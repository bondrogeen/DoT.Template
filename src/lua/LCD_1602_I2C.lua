
local id = 0
local bl = 0x08 -- back light on

local function send(d,r)
  local v = {}
  for i = 1, #d do
    table.insert(v, d[i] + bl + 0x04 + (r or 0))
    table.insert(v, d[i] + bl + (r or 0))
  end
  i2c.start(id)
  i2c.address(id, _WH1602.dev, i2c.TRANSMITTER)
  i2c.write(id, 0x00, v)
  i2c.stop(id)
end

local function init(t)
  if not _I2C then
    i2c.setup(id, t.sda, t.scl, i2c.SLOW)
  end

  _WH1602 = {}
  _WH1602.dev = t.dev or 0x27
  send({0x30})
  tmr.delay(4100)
  send({0x30})
  tmr.delay(100)
  send({0x30})
  send({0x20, 0x20, 0x80})
  send({0x00, 0x10})
  send({0x00, 0xc0})
  return true
end

local function cursor(op)
  if(op == 1)then
    send({0x00, 0xe0})
  else
    send({0x00, 0xc0})
  end
  return true
end

local function cls()
  send({0x00, 0x10})
  return true
end

local function home()
  send({0x00, 0x20})
  return true
end

local function lcd(t)
  if (t.line == 2)then
    send({0xc0, bit.lshift(t.col, 4)})
  elseif(t.line == 1)then
    send({0x80, bit.lshift(t.col, 4)})
  end

  for i = 1, #t.str do
    local char = string.byte(string.sub(t.str, i, i))
    send({bit.clear(char, 0, 1, 2, 3), bit.lshift(bit.clear(char, 4, 5, 6, 7), 4)}, 1)
  end
  return true
end

return function(t)
  local r = false
  if t.init then r = init(t.init) end
  if _WH1602 then
    if t.cls then r = cls() end
    if t.home then r = home() end
    if t.cursor then r = cursor(t.cursor) end
    if t.lcd then r = lcd(t.lcd) end
    if t.line1 then r = lcd({str = t.line1, line = 1, col = 0}) end
    if t.line2 then r = lcd({str = t.line2, line = 2, col = 0}) end
  end
  return r
end
