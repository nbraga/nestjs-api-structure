export interface ServiceResponseProps<params, errors, response> {
    execute: (params: params) => Promise<
        | {
              status: "success";
              data: response;
          }
        | {
              status: "error";
              error: errors;
          }
    >;
}
