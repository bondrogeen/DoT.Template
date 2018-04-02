return function (t)
 local r
 if adc then
  if adc.force_init_mode(t.adc and adc.INIT_VDD33 or adc.INIT_ADC)then
   print("ESP needs to be restarted for the change to take effect")
   node.restart()
   return
  else
   r= t.adc and "System voltage (mV): "..adc.readvdd33(0) or "adc : "..adc.read(0)
   print(r)
  end
 else
 print("The adc module is not installed")
 end
 return r
end
