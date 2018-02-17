var $inputTitle = $('.form__input-title');
var $inputBody = $('.form__input-body');
var $saveBtn = $('.form__button-save');
var $sectionIdea = $('.section__ideas');
var $sectionSearch = $('.section__search-field');

$inputBody.on('keyup', toggleDisableState);
$inputTitle.on('keyup', toggleDisableState);
$sectionIdea.on('click', '.delete-x', deleteIdeas);
$sectionIdea.on('click', '.upvote', upvoteIdea);
$sectionIdea.on('click', '.downvote', downvoteIdea);
// $sectionIdea.on('keydown', '.idea-title', persistTitle);
// $sectionIdea.on('keydown', '.idea-body', persistBody);
$sectionSearch.on('keyup', searchIdeas);
$saveBtn.on('click', saveIdea);

populatingIdeas();

function Idea(id, ideaTitleValue, ideaBodyValue) {
  this.id = id;
  this.title = ideaTitleValue;
  this.body = ideaBodyValue;
  this.quality = 'quality: swill';
}

function saveIdea(event) {
  event.preventDefault();
  var key = Date.now();
  var newIdea = new Idea(key, $inputTitle.val(), $inputBody.val());
  sendToStorage(newIdea);
  $('.section__ideas').prepend(`
  <article class="idea-cards" id="${newIdea.id}">
    <h2 class="idea-title" contenteditable="true">${newIdea.title}</h2>
    <article class="delete-x"></article>
    <p class="idea-body" contenteditable="true">${newIdea.body}</p>
    <article class="upvote"></article>
    <article class="downvote"></article>
    <h3 class="quality">${newIdea.quality}</h3>
  </article>`);
  clearInputs();
  toggleDisableState();
}

function populatingIdeas() {
  for (var i = 0; i < localStorage.length; i++) {
    var stringifiedObject = localStorage.getItem(localStorage.key(i));
    var idea = JSON.parse(stringifiedObject);
    $('.section__ideas').prepend(`<article class="idea-cards" id=${idea.id}>
      <h2 class="idea-title" contenteditable="true">${idea.title}</h2>
      <article class="delete-x" aria-label="Button to delete idea"></article>
      <p class="idea-body" contenteditable="true">${idea.body}</p>
      <article class="upvote"></article>
      <article class="downvote"></article>
      <h3 class="quality">${idea.quality}</h3>
      </article>`);
  }
}

function sendToStorage(idea) {
  var stringifiedIdea = JSON.stringify(idea);
  localStorage.setItem(idea.id, stringifiedIdea)
}

function clearInputs() {
  $inputTitle.val('');
  $inputBody.val('');
  $inputTitle.focus();
}

function toggleDisableState() {
  if ($inputBody.val() && $inputTitle.val()) {
    $saveBtn.prop('disabled', false);
  } else {
    $saveBtn.prop('disabled', true);
  }
}

function deleteIdeas() {
  $(this).closest('.idea-cards').fadeOut();
  var id = $(this).closest('.idea-cards').attr('id');
  localStorage.removeItem(id);
}

function changeStorageQuality(newthis) {
  var id = $(newthis).closest('.idea-cards').attr('id');
  var idea = localStorage.getItem(id);
  idea = JSON.parse(idea);
  idea.quality = $(newthis).siblings('h3').text();
  var stringifiedIdea = JSON.stringify(idea)
  localStorage.setItem(id, stringifiedIdea);
}

function upvoteIdea() {
  if ($(this).siblings('h3').text() === 'quality: swill') {
    $(this).siblings('h3').text('quality: plausible');
  } else if ($(this).siblings('h3').text() === 'quality: plausible') {
    $(this).siblings('h3').text('quality: genius');
  }
  changeStorageQuality(this)
}

function downvoteIdea() {
  if ($(this).siblings('h3').text() === 'quality: genius') {
    $(this).siblings('h3').text('quality: plausible')
  } else if ($(this).siblings('h3').text() === 'quality: plausible') {
    $(this).siblings('h3').text('quality: swill')
  }
  changeStorageQuality(this)
}

// function persistTitle(e) {
//   if (e.keyCode === 13) {
//     e.preventDefault();
//     $inputTitle.focus();
//   }
//   var id = $(this).closest('.idea-cards').attr('id');
//   var idea = localStorage.getItem(id);
//   idea = JSON.parse(idea);
//   idea.title = $(this).text();
//   var stringifiedIdea = JSON.stringify(idea);
//   localStorage.setItem(id, stringifiedIdea);
// }

// function persistBody(e) {
//   if (e.keyCode === 13) {
//     e.preventDefault();
//     $inputTitle.focus();
//   }
//   var id = $(this).closest('.idea-cards').attr('id');
//   var idea = localStorage.getItem(id);
//   idea = JSON.parse(idea);
//   idea.body = $(this).text();
//   var stringifiedIdea = JSON.stringify(idea);
//   localStorage.setItem(id, stringifiedIdea);
// }


function searchIdeas(){
  var $input = $('.section__search-field').val();
  $input = $input.toUpperCase();
  var card = $('.idea-cards');
  for (i = 0; i < card.length; i++){
  var title = $(card[i]).find('.idea-title').text().toUpperCase();
  var body = $(card[i]).find('.idea-body').text().toUpperCase();
  var quality = $(card[i]).find('.quality').text().toUpperCase();
  quality = quality.replace('QUALITY: ','');
  if(title.includes($input)|| body.includes($input) || quality.includes($input)){
    $(card[i]).show();
  } else { 
    $(card[i]).hide();
  }
  }
}

