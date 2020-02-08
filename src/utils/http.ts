export interface IHttpResponse<T> extends Response {
    parsedBody?: T;
  }
  
export const http = <T>(request: RequestInfo): Promise<IHttpResponse<T>> => {
    let response: IHttpResponse<T>;
    return new Promise(resolve => {
      fetch(request)
        .then(res => {
          response = res;
          return res.json();
        })
        .then(body => {
          response.parsedBody = body;
          resolve(response);
        });
    });
  };