const fs = require('fs');
const path = require('path');

// posts-data.json 읽기
const postsDataPath = path.join(__dirname, '../posts/posts-data.json');
const postsData = JSON.parse(fs.readFileSync(postsDataPath, 'utf8'));

// 마크다운 파일들이 있는 디렉토리
const dailyPostsDir = path.join(__dirname, '../posts/daily/2025-05');
const techPostsDir = path.join(__dirname, '../posts/tech');

// 각 daily 포스트의 content를 실제 .md 파일 내용으로 업데이트
postsData.daily.forEach(post => {
  const date = post.date;
  const mdFilePath = path.join(dailyPostsDir, `${date}.md`);
  
  if (fs.existsSync(mdFilePath)) {
    const mdContent = fs.readFileSync(mdFilePath, 'utf8');
    console.log(`Updating daily content for ${date}`);
    post.content = mdContent;
  } else {
    console.log(`Warning: ${mdFilePath} not found`);
  }
});

// 각 tech 포스트의 content를 실제 .md 파일 내용으로 업데이트
postsData.tech.forEach(post => {
  // tech 포스트는 직접 매핑
  if (post.id === '2024-05-23-github-blog-system') {
    const mdFilePath = path.join(techPostsDir, '2024-05-23-github-blog-system.md');
    
    if (fs.existsSync(mdFilePath)) {
      const mdContent = fs.readFileSync(mdFilePath, 'utf8');
      console.log(`Updating tech content for ${post.date}`);
      post.content = mdContent;
    } else {
      console.log(`Warning: ${mdFilePath} not found`);
    }
  }
});

// 업데이트된 데이터 저장
fs.writeFileSync(postsDataPath, JSON.stringify(postsData, null, 2), 'utf8');
console.log('All posts content updated successfully!'); 