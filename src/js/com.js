const post = async function (path, body, headers = {}) {
  const url = `${path}`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  };
  const res = await fetch(url, options);
  const data = await res.json();
  if (res.ok) {
    return data;
  } else {
    throw Error(data);
  }
}

const get = async function (path, body, headers = {}) {

  let param = "";
  Object.keys(body).forEach(function(key){

    if(body[key] === null) return true;

    if(param.length > 0){
      param +="&";
    }
    if(param.length == 0){
      param +="?";
    }
    param += key+"="+body[key];

    // echo(key,body[key]);
  });

  echo(param);

  const url = `${path}${param}`;
  const options = {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    }
  };
  const res = await fetch(url, options);
  const data = await res.json();
  if (res.ok) {
    return data;
  } else {
    throw Error(data);
  }
}

const echo = function(...args){
  console.log(args);
}


export { post,get , echo}
