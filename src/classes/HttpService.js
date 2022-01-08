
export default class HttpService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  
  async get(path) {
    let reqHeader = new Headers();
    reqHeader.append('Content-Type', 'text/json');

    let initObject = {
        method: 'GET',
        headers: reqHeader,
    };

    let userRequest = new Request(this.baseUrl.concat(path), initObject);
    let response = await fetch(userRequest);
    return await response.json();
  }
}
