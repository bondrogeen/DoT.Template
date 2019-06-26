exports.obj = {
  "name": "Template",
  "type": "module",
  "description": "Template plugin for DoT.",
  "version": "0.0.1",
  "homepage": "",
  "files": [],
  "page": "Template.html",
  "img": "https://raw.githubusercontent.com/bondrogeen/Template/master/doc/logo.jpg",
  "repository": {
    "type": "git",
    "url": ""
  },
  "author": {
    "name": "you_name",
    "email": "you_name@gmail.com"
  },

  "native": [
    {
      "id": "run",
      "val": false,
      "type": "checkbox",
      "name": "Run"
  }, {
      "id": "select0",
      "val": "One",
      "type": "select",
      "values": ["One", "Two"],
      "name": "Label select"
  }, {
      "id": "text1",
      "val": "defalult_text",
      "type": "text",
      "name": "Label text"
  }, {
      "id": "number2",
      "val": 123,
      "type": "number",
      "min": 0,
      "max": 150,
      "name": "Label number"
  }

 ],
  "license": "MIT",
  "modules": ["adc"]
};

exports.lua =
  'return function (table) \n' +
  '  local r\n' +
  '  print("id select0 = "..table.select0)\n' +
  '  print("id text1 = "..table.text1)\n' +
  '  print("id number2 = "..table.number2)\n' +
  '  return r\n' +
  'end';


exports.mqtt = '--[[ \nOnly if the MQTT plugin is installed. \nThe script will run every time you connect to the mqtt server. For example, if you need to pass the initial topics \n--]] \n\n' +
  'return function (time) \n' +
  '  local r\n' +
  '  if time then \n' +
  '    _M:pub("Template/comm/mydata", "")\n' +
  '    _M:pub("Template/info/ver", "0.0.4")\n' +
  '  end\n' +
  '  return r\n' +
  'end';

exports.net = '--[[ \nThe script will run when the ESP is connected to the network. \nSettings will be transferred to the table "table" \n--]] \n\n' +
  'return function (table) \n' +
  '  local r\n' +
  '  if table.run then \n' +
  '    r = dofile("Template.lua")(table)\n' +
  '  end\n' +
  '  return r\n' +
  'end';

exports.run = '--[[ \nThe script will be launched when ESP starts. \nSettings will be transferred to the table "table" \n--]] \n\n' +
  'return function (table) \n' +
  '  local r\n' +
  '  if table.run then \n' +
  '    r = dofile("Template.lua")(table)\n' +
  '  end\n' +
  '  return r\n' +
  'end';
