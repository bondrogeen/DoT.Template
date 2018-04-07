return function (t)
 local r
  if adc.force_init_mode(t.mode=='vdd' and adc.INIT_VDD33 or adc.INIT_ADC)then
   print("ESP needs to be restarted for the change to take effect")
   node.restart()
  else
   r= t.mode=='vdd' and "System voltage (mV): "..adc.readvdd33(0) or "adc : "..adc.read(0)
  end
 return r
end
