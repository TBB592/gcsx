async (page) => {
 const base='http://127.0.0.1:4175/gcsx/';
 const check=(value,message)=>{if(!value)throw new Error(message);};
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 for(const width of [360,1280]){
  await page.setViewportSize({width,height:900});await page.goto(base,{waitUntil:'networkidle'});
  const search=page.getByRole('searchbox',{name:'搜索学习资料'});await search.waitFor({state:'visible'});
  check(await page.locator('.subject-card:visible').count()===3,'Catalog missing');
  await search.fill('高等数学');check(await page.locator('.subject-card:visible').count()===1,'Search missing');
  await page.getByRole('button',{name:'清空搜索',exact:true}).click();
  await page.locator('[data-category="courses"]').click();check(await page.locator('#course-subcategories').isVisible(),'Subcategories missing');
  await page.locator('[data-category="humanities"]').click();check(await page.locator('#empty-title').innerText()==='暂未上传文科资料','Humanities missing');
  await page.locator('[data-category="course-guide"]').click();check(await page.locator('#empty-title').innerText()==='选课指引，整理中','Guide missing');
  await page.locator('[data-category="campus-life"]').click();check(await page.locator('#empty-title').innerText()==='校园生活指南，整理中','Life missing');
  await page.locator('[data-category="all"]').click();
  await page.locator('a.read-subject[href="advanced-mathematics.html"]').click();
  await page.locator('.page-jump').waitFor({state:'visible'});
  check(await page.locator('.page-sheet').count()===106,'Legacy reader link missing');
  for(const [slug,count] of [['advanced-mathematics',106],['engineering-mathematics',5],['university-physics-2',34]]){
   await page.goto(base+slug+'.html',{waitUntil:'domcontentloaded'});await page.locator('.page-jump').waitFor({state:'visible'});
   check(await page.locator('.page-sheet').count()===count,'Pages mismatch: '+slug);
   await page.getByRole('spinbutton',{name:'页码',exact:true}).fill(String(count));await page.getByRole('spinbutton',{name:'页码',exact:true}).press('Enter');
   check(page.url().endsWith('#pdf-page-'+count),'Jump missing');
   const img=page.locator('#pdf-page-'+count+' img');await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());check(await img.evaluate(el=>el.naturalWidth>1000),'Image missing');
   await page.getByRole('button',{name:'💡 希望补充内容',exact:true}).click();check(await page.locator('#feedback-group').isVisible(),'Feedback missing');
   check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Overflow');
  }
  await page.getByRole('link',{name:'返回学科首页',exact:true}).click();await search.waitFor({state:'visible'});
  check(await page.locator('.subject-card').count()===3,'Return navigation failed');
  check(await page.locator('iframe[src="counter.html"]').count()===1,'Counter moved');
  check(!/南京理工|南理工/.test(await page.locator('body').innerText()),'Institution name visible');
  await page.screenshot({path:'F:/桌面迁移/网站/学术网站/迁移交付/output/playwright/vitepress-'+width+'.png',fullPage:true});
 }
 const ctx=await page.context().browser().newContext({javaScriptEnabled:false});const fallback=await ctx.newPage();await fallback.goto(base);
 check(await fallback.locator('.subject-card:visible').count()===3,'No-JS static content missing');
 check(!await fallback.locator('.library-search').isVisible(),'Inactive no-JS controls visible');
 await fallback.goto(base+'advanced-mathematics.html');check(await fallback.locator('.page-sheet').count()===106,'No-JS reader missing');await ctx.close();
 check(errors.length===0,'Browser errors: '+errors.join(';'));
 return {passed:true,ssg:'VitePress',viewports:[360,1280],pdfPages:145};
}
