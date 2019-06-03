# DoT
 
The plugin LCD WH1602 (I2C PCF8574) for [DoT](https://github.com/bondrogeen/DoT)


or

```lua

dofile("LCD_1602_I2C.lua")({init = {sda = 4, scl = 3}}) --initialization i2c and WH1601

dofile("LCD_1602_I2C.lua")({lcd = {str = "Test lcd Lin1 1", line = 1, col = 0}}) --print on the first line 

dofile("LCD_1602_I2C.lua")({lcd = {str = "line 2", line = 2, col = 5}}) --print on the second line 

dofile("LCD_1602_I2C.lua")({cls = true}) --clear screen 

dofile("LCD_1602_I2C.lua")({cursor = 1})  -- cursor=1 - show cursor, cursor=0 - hide cursor

dofile("LCD_1602_I2C.lua")({home = true}) --set the cursor to the beginning of the first line


```
## Changelog

### 0.0.2 (2018-06-20)
* (bondrogeen) minor fix.
### 0.0.1 (2018-06-7)
* (bondrogeen) init.
