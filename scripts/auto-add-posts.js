const fs = require('fs');
const path = require('path');

// posts-data.json 읽기
const postsDataPath = path.join(__dirname, '../posts/posts-data.json');
const postsData = JSON.parse(fs.readFileSync(postsDataPath, 'utf8'));

// 마크다운 파일들이 있는 디렉토리
const dailyPostsDir = path.join(__dirname, '../posts/daily');

// 기존 포스트 ID 목록 생성
const existingPostIds = new Set(postsData.daily.map(post => post.id));

// Front Matter 파싱 함수
function parseFrontMatter(content) {
  const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontMatterRegex);
  
  if (!match) {
    return { frontMatter: {}, content: content };
  }
  
  const frontMatterStr = match[1];
  const bodyContent = match[2];
  const frontMatter = {};
  
  frontMatterStr.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      frontMatter[key.trim()] = valueParts.join(':').trim();
    }
  });
  
  return { frontMatter, content: bodyContent };
}

// 제목에서 간단한 excerpt 생성
function generateExcerpt(content, title) {
  // 마크다운에서 첫 번째 문단 추출
  const lines = content.split('\n').filter(line => line.trim());
  const firstParagraph = lines.find(line => 
    !line.startsWith('#') && 
    !line.startsWith('---') && 
    line.length > 10
  );
  
  if (firstParagraph) {
    return firstParagraph.length > 100 
      ? firstParagraph.substring(0, 100) + '...'
      : firstParagraph;
  }
  
  return `${title}에 대한 학습 내용을 정리해보았다.`;
}

// 태그 추출 (제목에서 키워드 추출)
function extractTags(title, content) {
  const commonTags = {
    'git': 'Git',
    'blog': '블로그',
    'javascript': 'JavaScript',
    'react': 'React',
    'css': 'CSS',
    'html': 'HTML',
    'node': 'Node.js',
    '연습': '연습',
    '학습': '학습',
    '프로젝트': '프로젝트',
    '개발': '개발'
  };
  
  const tags = [];
  const text = (title + ' ' + content).toLowerCase();
  
  Object.keys(commonTags).forEach(keyword => {
    if (text.includes(keyword)) {
      tags.push(commonTags[keyword]);
    }
  });
  
  return tags.length > 0 ? tags : ['학습', '개발'];
}

// 이미지 URL 생성 (Unsplash에서 랜덤)
function generateImageUrl() {
  const imageIds = [
    'photo-1516321318423-f06f85e504b3',
    'photo-1555066931-4365d14bab8c',
    'photo-1518432031352-d6fc5c10da5a',
    'photo-1461749280684-dccba630e2f6',
    'photo-1515879218367-8466d910aaa4'
  ];
  const randomId = imageIds[Math.floor(Math.random() * imageIds.length)];
  return `https://images.unsplash.com/${randomId}?w=400&h=200&fit=crop`;
}

// 모든 연도/월 폴더 스캔
function scanAllDateFolders() {
  const dailyPath = path.join(__dirname, '../posts/daily');
  const newPosts = [];
  
  if (!fs.existsSync(dailyPath)) {
    console.log('Daily posts directory not found');
    return newPosts;
  }
  
  const yearFolders = fs.readdirSync(dailyPath).filter(folder => 
    fs.statSync(path.join(dailyPath, folder)).isDirectory()
  );
  
  yearFolders.forEach(yearMonth => {
    const yearMonthPath = path.join(dailyPath, yearMonth);
    const mdFiles = fs.readdirSync(yearMonthPath).filter(file => file.endsWith('.md'));
    
    mdFiles.forEach(file => {
      const filePath = path.join(yearMonthPath, file);
      const fileName = path.basename(file, '.md');
      
      // 날짜 형식 확인 (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fileName)) {
        return;
      }
      
      const postId = `${fileName}-auto-generated`;
      
      // 이미 존재하는 포스트인지 확인
      if (existingPostIds.has(postId)) {
        return;
      }
      
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { frontMatter, content } = parseFrontMatter(fileContent);
        
        const title = frontMatter.title || `${fileName} 학습 일지`;
        const description = frontMatter.description || `${fileName}의 학습 내용 정리`;
        const tags = extractTags(title, content);
        const excerpt = generateExcerpt(content, title);
        
        const newPost = {
          id: postId,
          title: title,
          date: fileName,
          category: 'daily',
          tags: tags,
          image: generateImageUrl(),
          description: description,
          excerpt: excerpt,
          content: fileContent
        };
        
        newPosts.push(newPost);
        console.log(`✅ 새 포스트 발견: ${fileName} - ${title}`);
        
      } catch (error) {
        console.error(`❌ 파일 처리 실패: ${filePath}`, error.message);
      }
    });
  });
  
  return newPosts;
}

// 메인 실행
function main() {
  console.log('📁 새로운 마크다운 파일을 스캔하는 중...');
  
  const newPosts = scanAllDateFolders();
  
  if (newPosts.length === 0) {
    console.log('🔍 새로운 포스트가 없습니다.');
    return;
  }
  
  // 날짜순으로 정렬 (최신순)
  newPosts.sort((a, b) => b.date.localeCompare(a.date));
  
  // posts-data.json에 추가 (앞쪽에 추가)
  postsData.daily = [...newPosts, ...postsData.daily];
  
  // 파일 저장
  fs.writeFileSync(postsDataPath, JSON.stringify(postsData, null, 2), 'utf8');
  
  console.log(`🎉 ${newPosts.length}개의 새 포스트를 추가했습니다!`);
  newPosts.forEach(post => {
    console.log(`   - ${post.date}: ${post.title}`);
  });
}

// 스크립트 실행
main();