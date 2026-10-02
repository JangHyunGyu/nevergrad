'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../assets/js/i18n');
const languages=['en','ja','es','fr','de','pt','zh'];
const data=Object.fromEntries(languages.map(lang=>[lang,Object.assign({},...fs.readdirSync(path.join(root,lang)).filter(f=>/^day[1-5]_.*\.json$/.test(f)).map(f=>JSON.parse(fs.readFileSync(path.join(root,lang,f),'utf8'))))]));

test('Minsu message observation retains the missing emoticon without invented insults',()=>{
 const emoticon={en:/emoticon/,ja:/絵文字|顔文字/,es:/emoticono|emoji/,fr:/émoticône|emoji/,de:/Emoticon|Emoji/,pt:/emoticon|emoji/,zh:/表情/};
 for(const lang of languages){
  const text=data[lang].day2_night_phone_7.text;
  assert.match(text,emoticon[lang],lang);
  assert.doesNotMatch(text,/insults|罵倒|悪口|insultos|insultes|Beleidigungen|辱骂|脏话/,lang);
 }
});

test('power interruption includes the fluorescent lights going out in every language',()=>{
 const light={en:/fluorescent/,ja:/蛍光灯/,es:/fluorescen/,fr:/néon|fluorescen/,de:/Leuchtstoff/,pt:/fluorescen/,zh:/荧光灯/};
 for(const lang of languages)assert.match(data[lang].day5_after_caught_resist_4.text,light[lang],lang);
});

test('forgetting ending concerns naming the familiar face',()=>{
 assert.match(data.en.day5_ending_forget_16.text,/name/);
 assert.doesNotMatch(data.en.day5_ending_forget_16.text,/anything to say/);
});
