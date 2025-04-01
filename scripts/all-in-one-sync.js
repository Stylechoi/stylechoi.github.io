const fs = require('fs');
const path = require('path');

console.log('🚀 블로그 통합 동기화 시작...\n');

// posts-data.json 읽기
const postsDataPath = path.join(__dirname, '../posts/posts-data.json');
let postsData;

try {
  postsData = JSON.parse(fs.readFileSync(postsDataPath, 'utf8'));
} catch (error) {
  console.log('📝 posts-data.json이 없거나 손상됨. 새로 생성합니다.');
  postsData = { daily: [], tech: [] };
}

// 마크다운에서 제목 추출 (첫 번째 # 헤더)
function extractTitleFromContent(content) {
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ')) {
      return trimmed.substring(2).trim();
    }
  }
  return null;
}

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

// 해시태그에서 태그 추출
function extractHashtags(content) {
  const hashtagRegex = /#([\w가-힣]+)/g;
  const hashtags = [];
  let match;
  
  while ((match = hashtagRegex.exec(content)) !== null) {
    hashtags.push(match[1]);
  }
  
  return hashtags.length > 0 ? hashtags : ['학습', '개발'];
}

// 태그 추출
function extractTags(title, content) {
  const hashtagsFromContent = extractHashtags(content);
  if (hashtagsFromContent.length > 0 && !hashtagsFromContent.includes('학습')) {
    return hashtagsFromContent;
  }
  
  const commonTags = {
    'git': 'Git',
    'blog': '블로그', 
    'javascript': 'JavaScript',
    'react': 'React',
    'css': 'CSS',
    'html': 'HTML',
    'node': 'Node.js',
    'python': 'Python',
    'java': 'Java',
    '연습': '연습',
    '학습': '학습',
    '프로젝트': '프로젝트',
    '개발': '개발',
    '알고리즘': '알고리즘',
    '자료구조': '자료구조'
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

// 이미지 URL 생성
function generateImageUrl() {
  const imageIds = [
    'photo-1516321318423-f06f85e504b3',
    'photo-1555066931-4365d14bab8c', 
    'photo-1518432031352-d6fc5c10da5a',
    'photo-1461749280684-dccba630e2f6',
    'photo-1515879218367-8466d910aaa4',
    'photo-1542831371-29b0f74f9713',
    'photo-1504639725590-34d0984388bd',
    'photo-1498050108023-c5249f4df085',
    'photo-1488590528505-98d2b5aba04b',
    'photo-1484417894907-623942c8ee29'
  ];
  const randomId = imageIds[Math.floor(Math.random() * imageIds.length)];
  return `https://images.unsplash.com/${randomId}?w=400&h=200&fit=crop`;
}

// Daily 포스트 스캔 및 동기화
function syncDailyPosts() {
  const dailyPath = path.join(__dirname, '../posts/daily');
  const allPosts = [];
  
  if (!fs.existsSync(dailyPath)) {
    console.log('❌ Daily posts directory not found');
    return allPosts;
  }
  
  console.log('📁 Daily 포스트 스캔 중...');
  
  const yearFolders = fs.readdirSync(dailyPath).filter(folder => 
    fs.statSync(path.join(dailyPath, folder)).isDirectory()
  );
  
  let totalFiles = 0;
  
  yearFolders.forEach(yearMonth => {
    const yearMonthPath = path.join(dailyPath, yearMonth);
    const mdFiles = fs.readdirSync(yearMonthPath).filter(file => file.endsWith('.md'));
    
    totalFiles += mdFiles.length;
    console.log(`   📂 ${yearMonth}: ${mdFiles.length}개 파일`);
    
    mdFiles.forEach(file => {
      const filePath = path.join(yearMonthPath, file);
      const fileName = path.basename(file, '.md');
      
      // 날짜 형식 확인 (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fileName)) {
        console.log(`   ⚠️  날짜 형식 오류로 건너뜀: ${fileName}`);
        return;
      }
      
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { frontMatter } = parseFrontMatter(fileContent);
        
        // 제목 추출: Front Matter > 첫 번째 # 헤더 > 파일명
        const titleFromContent = extractTitleFromContent(fileContent);
        const title = frontMatter.title || titleFromContent || `${fileName} 학습 일지`;
        const description = frontMatter.description || `${fileName}의 학습 내용 정리`;
        const tags = extractTags(title, fileContent);
        const excerpt = generateExcerpt(fileContent, title);
        
        const post = {
          id: `${fileName}-auto-generated`,
          title: title,
          date: fileName,
          category: 'daily',
          tags: tags,
          image: generateImageUrl(),
          description: description,
          excerpt: excerpt,
          content: fileContent
        };
        
        allPosts.push(post);
        
      } catch (error) {
        console.error(`   ❌ 파일 처리 실패: ${fileName} - ${error.message}`);
      }
    });
  });
  
  console.log(`   ✅ 총 ${allPosts.length}/${totalFiles}개 Daily 포스트 처리 완료\n`);
  return allPosts;
}

// Tech 포스트 스캔 및 동기화
function syncTechPosts() {
  const techPath = path.join(__dirname, '../posts/tech');
  const allPosts = [];
  
  if (!fs.existsSync(techPath)) {
    console.log('📁 Tech posts directory not found - 건너뜀');
    return allPosts;
  }
  
  console.log('📁 Tech 포스트 스캔 중...');
  
  const mdFiles = fs.readdirSync(techPath).filter(file => file.endsWith('.md'));
  
  console.log(`   📂 tech: ${mdFiles.length}개 파일`);
  
  mdFiles.forEach(file => {
    const filePath = path.join(techPath, file);
    const fileName = path.basename(file, '.md');
    
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { frontMatter } = parseFrontMatter(fileContent);
      
      // 제목 추출
      const titleFromContent = extractTitleFromContent(fileContent);
      const title = frontMatter.title || titleFromContent || fileName;
      const description = frontMatter.description || `${title}에 대한 기술 포스트`;
      const tags = extractTags(title, fileContent);
      const excerpt = generateExcerpt(fileContent, title);
      
      // 날짜 추출 (파일명에서 YYYY-MM-DD 형식 찾기)
      const dateMatch = fileName.match(/(\d{4}-\d{2}-\d{2})/);
      const postDate = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];
      
      const post = {
        id: fileName,
        title: title,
        date: postDate,
        category: 'tech',
        tags: tags,
        image: generateImageUrl(),
        description: description,
        excerpt: excerpt,
        content: fileContent
      };
      
      allPosts.push(post);
      
    } catch (error) {
      console.error(`   ❌ 파일 처리 실패: ${fileName} - ${error.message}`);
    }
  });
  
  console.log(`   ✅ 총 ${allPosts.length}개 Tech 포스트 처리 완료\n`);
  return allPosts;
}

// 삭제된 파일 감지 및 제거
function cleanupDeletedPosts(currentPosts, category) {
  if (!postsData[category]) {
    return [];
  }
  
  const currentIds = new Set(currentPosts.map(post => post.id));
  const existingPosts = postsData[category];
  const deletedPosts = existingPosts.filter(post => !currentIds.has(post.id));
  
  if (deletedPosts.length > 0) {
    console.log(`🗑️  ${category} 카테고리에서 삭제된 포스트 ${deletedPosts.length}개 발견:`);
    deletedPosts.forEach(post => {
      console.log(`   - ${post.date}: ${post.title}`);
    });
  }
  
  return deletedPosts;
}

// 메인 실행 함수
function main() {
  try {
    // Daily 포스트 동기화
    const dailyPosts = syncDailyPosts();
    
    // Tech 포스트 동기화  
    const techPosts = syncTechPosts();
    
    // 삭제된 포스트 감지
    const deletedDaily = cleanupDeletedPosts(dailyPosts, 'daily');
    const deletedTech = cleanupDeletedPosts(techPosts, 'tech');
    
    // 날짜순으로 정렬 (최신순)
    dailyPosts.sort((a, b) => b.date.localeCompare(a.date));
    techPosts.sort((a, b) => b.date.localeCompare(a.date));
    
    // posts-data.json 업데이트
    postsData.daily = dailyPosts;
    postsData.tech = techPosts;
    
    // 파일 저장
    fs.writeFileSync(postsDataPath, JSON.stringify(postsData, null, 2), 'utf8');
    
    // 결과 요약
    console.log('🎉 통합 동기화 완료!\n');
    console.log('📊 처리 결과:');
    console.log(`   - Daily 포스트: ${dailyPosts.length}개`);
    console.log(`   - Tech 포스트: ${techPosts.length}개`);
    console.log(`   - 삭제된 포스트: ${deletedDaily.length + deletedTech.length}개`);
    console.log(`   - 총 포스트: ${dailyPosts.length + techPosts.length}개\n`);
    
    if (dailyPosts.length > 0) {
      console.log('📋 최근 Daily 포스트 (최대 5개):');
      dailyPosts.slice(0, 5).forEach((post, index) => {
        console.log(`   ${index + 1}. ${post.date}: ${post.title}`);
      });
      console.log('');
    }
    
    if (techPosts.length > 0) {
      console.log('📋 최근 Tech 포스트 (최대 5개):');
      techPosts.slice(0, 5).forEach((post, index) => {
        console.log(`   ${index + 1}. ${post.date}: ${post.title}`);
      });
      console.log('');
    }
    
    console.log('✨ 모든 작업이 완료되었습니다!');
    
  } catch (error) {
    console.error('❌ 동기화 중 오류 발생:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// 스크립트 실행
main();