'use client';

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { addAxiosDateTransformer } from 'axios-date-transformer';

import { Forbidden } from '../errors/Forbidden';
import { HttpError } from '../errors/HttpError';
import { Unauthorized } from '../errors/Unauthorized';

export class ApiClient {
  constructor(
    private readonly baseUrl: string,
    private readonly headers: Record<string, string>,
    private readonly authToken: string = ''
  ) {}

  public async get<Arguments extends object = {}, Response = undefined>(
    endpoint: string = '',
    params?: Arguments,
    signal?: AbortSignal
  ): Promise<Response> {
    try {
      const client = this.createClient(params);
      const response = await client.get(endpoint, { signal });
      return response.data.value as Response;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  public async delete<Arguments extends object = {}, Response = undefined>(
    endpoint: string = '',
    params?: Arguments,
    signal?: AbortSignal
  ): Promise<Response> {
    try {
      const client = this.createClient(params);
      const response = await client.delete(endpoint, { signal });
      return response.data.value as Response;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  public async post<Arguments, Response = undefined>(
    endpoint: string = '',
    data?: Arguments,
    signal?: AbortSignal
  ): Promise<Response> {
    try {
      const client = this.createClient();

      const response = await client.post(endpoint, data, { signal });
      return response.data.value as Response;
    } catch (error) {
      this.handleError(error);
    }
  }

  public async put<Arguments, Response = undefined>(
    endpoint: string = '',
    data?: Arguments,
    signal?: AbortSignal
  ): Promise<Response> {
    try {
      const client = this.createClient();

      const response = await client.put(endpoint, data, { signal });
      return response.data.value as Response;
    } catch (error) {
      debugger;
      this.handleError(error);
    }
  }

  public async uploadFile<Response>(
    endpoint: string = '',
    formData: FormData
  ): Promise<Response> {
    try {
      const client = this.createClient();
      const response = await client.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.value as Response;
    } catch (error) {
      this.handleError(error);
    }
  }

  private createClient(params: object = {}): AxiosInstance {
    const config: AxiosRequestConfig = {
      baseURL: this.baseUrl,
      headers: this.headers,
      params: params,
    };
    if (this.authToken) {
      config.headers = {
        Authorization: `Bearer ${this.authToken}`,
      };
    }

    const axiosInstance = axios.create(config);

    return addAxiosDateTransformer(axiosInstance, {
      allowlist: ['birthDate', 'createdAt', 'updatedAt'],
    });
  }

  private handleError(error: any): never {
    if (!error.response) {
      throw new HttpError(error.message);
    } else if (error.response.status === 401) {
      throw new Unauthorized(error.response.data);
    } else if (error.response.status === 403) {
      throw new Forbidden(error.response.data);
    } else {
      throw error;
    }
  }
}
