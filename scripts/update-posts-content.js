const fs = require('fs');
const path = require('path');

// posts-data.json 읽기
const postsDataPath = path.join(__dirname, '../posts/posts-data.json');
const postsData = JSON.parse(fs.readFileSync(postsDataPath, 'utf8'));

// 마크다운 파일들이 있는 디렉토리
const dailyPostsDir = path.join(__dirname, '../posts/daily/2025-05');

// 각 포스트의 content를 실제 .md 파일 내용으로 업데이트
postsData.daily.forEach(post => {
  const date = post.date;
  const mdFilePath = path.join(dailyPostsDir, `${date}.md`);
  
  if (fs.existsSync(mdFilePath)) {
    const mdContent = fs.readFileSync(mdFilePath, 'utf8');
    console.log(`Updating content for ${date}`);
    post.content = mdContent;
  } else {
    console.log(`Warning: ${mdFilePath} not found`);
  }
});

// 업데이트된 데이터 저장
fs.writeFileSync(postsDataPath, JSON.stringify(postsData, null, 2), 'utf8');
console.log('Posts content updated successfully!'); 