@echo off
echo 📝 포스트 동기화 시작...
echo.

node scripts/all-in-one-sync.js

echo.
echo ✅ 동기화 완료! 
echo 💡 이제 git add, commit, push 하시면 됩니다.
echo.
pause 