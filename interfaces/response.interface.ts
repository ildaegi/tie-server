export interface IBaseResponse {
  result: boolean;
}

export interface IRowResponse<T> extends IBaseResponse {
  data: {
    count: number;
    rows: T[];
  };
}

export interface ErrorResponse extends IBaseResponse {
  reason: string;
}
