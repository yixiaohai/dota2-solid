@echo off
for /r %%s in (*.png) do (
"D:\\Program Files (x86)\\Steam\\steamapps\\common\\dota 2 beta\\game\\bin\\win64\\resourcecompiler.exe" -game "D:\\Program Files (x86)\\Steam\\steamapps\\common\\dota 2 beta\\game\\dota" -i "%%s" -outroot "C:\Users\86066\Desktop\temp"
)
pause