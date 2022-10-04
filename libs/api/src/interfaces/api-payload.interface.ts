export type JSONObject = {
  [key in string]?: JSONValue;
};

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONObject
  | Array<JSONValue>;

export interface ApiPayloadInterface {
  payload: JSONObject;
}
