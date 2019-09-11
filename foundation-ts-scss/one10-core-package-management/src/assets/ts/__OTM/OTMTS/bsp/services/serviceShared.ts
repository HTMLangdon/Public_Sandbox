
//export class Response
//{
//	public ResultCode: number;
//	public ResultMessage: string;
//}

/**
 * Web service error response.
 */
//export class WsError {
//	/** Error code. */
//	public Code: string;
//	/** Error description. */
//	public Description: string;
//}

///**
// * Web service response information.
// */
//export class WsResponse {
//	/**
//	 * Numeric status code. This generally equates to HTTP status codes (200, etc.)
//	 * This code does not reflect the response to the action (e.g., success, not found, access denied).
//	 * @see ResponseCode
//	 */
//	public StatusCode: number;
//	/** Status message. */
//	public Status: string;
//	/** Numeric response message. */
//	public ResponseCode: number;
//	/** Response message. */
//	public ResponseMessage: string;
//	/** Collection of errors. This may be empty. */
//	public Errors: WsError[];

//	/**
//	 * Create a standard "success" response.
//	 * @returns {WsResponse} Success response instance.
//	 */
//	public static Success(): WsResponse;
//}

///**
// * Web service response information with associated returned data.
// */
//export class WsResponseData<T> extends WsResponse {
//	/** Response data. */
//	public Data: T;

//	/**
//	 * Create a standard "success" response.
//	 * @param {T} data - Response data.
//	 * @returns {WsResponseData<T>} Success response instance.
//	 */
//	public static SuccessData<T>(data: T): WsResponseData<T>;
//}

