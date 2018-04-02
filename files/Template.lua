return function (t)
if adc.force_init_mode(adc.INIT_VDD33)
then
  print(adc.read())
end
end
