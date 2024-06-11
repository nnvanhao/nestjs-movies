import { BadRequestException, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class FileManagementService {
  private readonly s3: AWS.S3;
  AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  async uploadFile(file) {
    const fileExtension = path.extname(file.originalname);
    const fileName = `files/${uuidv4()}${fileExtension}`;

    // Append timestamp to file content
    const timestamp = new Date().toISOString();
    const modifiedContent = Buffer.concat([
      file.buffer,
      Buffer.from(`\nTimestamp: ${timestamp}`),
    ]);

    const result = await this.s3Upload(
      modifiedContent,
      this.AWS_S3_BUCKET,
      fileName,
      file.mimetype,
    );
    if (result) {
      return {
        id: result.ETag.replace(/"/g, ''),
        key: result?.Key,
        url: result?.Location,
        fileName: file.originalname,
      };
    }
  }

  async s3Upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
    };

    try {
      const s3Response = await this.s3
        .upload(params, { partSize: 10 * 1024 * 1024, queueSize: 1 })
        .promise();
      return s3Response;
    } catch (e) {
      console.log(e);
      throw new Error('Error uploading file to S3');
    }
  }

  async deleteFile(etag: string) {
    // Step 1: List objects in the bucket
    const listParams = {
      Bucket: this.AWS_S3_BUCKET,
    };

    const listResponse = await this.s3.listObjectsV2(listParams).promise();
    const objects = listResponse.Contents;

    if (!objects || objects.length === 0) {
      throw new BadRequestException('No objects found in S3 bucket');
    }

    // Step 2: Find the object with the matching ETag
    const objectToDelete = objects.find((obj) => obj.ETag === `\"${etag}\"`);

    if (!objectToDelete) {
      throw new BadRequestException('Object with the specified ETag not found');
    }

    // Step 3: Delete the object by key
    const deleteParams = {
      Bucket: this.AWS_S3_BUCKET,
      Key: objectToDelete.Key,
    };

    const deleteResponse = await this.s3.deleteObject(deleteParams).promise();
    return deleteResponse;
  }
}
