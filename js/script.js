$('.todo-form__input-title').on('keyup', toggleDisableState);
$('.todo-form__input-body').on('keyup', toggleDisableState);
$('.todo-list__ideas').on('click', '.delete-x', deleteIdeas);
$('.todo-list__ideas').on('click', '.upvote', upvoteIdea);
$('.todo-list__ideas').on('click', '.downvote', downvoteIdea);
// $sectionIdea.on('keydown', '.idea-title', persistTitle);
// $sectionIdea.on('keydown', '.idea-body', persistBody);
$('.todo-list__search-field').on('keyup', searchIdeas);
$('.todo-list__ideas').on('click', '.checkMark', changeReadClass);
$('.todo-form__button-save').on('click', saveIdea);
$('.completedBtn').on('click', saveIdea);
$('.completedTask').on('click', sortCompleted);


populatingIdeas();

function Idea(key, ideaTitleValue, ideaBodyValue) {
  this.levelsImportance = [
    'Critical',
    'High',
    'Normal',
    'Low',
    'None'
  ];
  this.key = key;
  this.title = ideaTitleValue;
  this.body = ideaBodyValue;
  this.completed = false;
  this.importanceValue = 2;
}

function saveIdea(event) {
  event.preventDefault();
  var key = Date.now();
  var $inputTitle = $('.todo-form__input-title');
  var $inputBody = $('.todo-form__input-body');
  var newIdea = new Idea(key, $inputTitle.val(), $inputBody.val());
  sendToStorage(newIdea);
  $('.todo-list__ideas').prepend(`
  <article class="idea-cards" id="${newIdea.key}">
    <p class = "checkMark">&#x02713</p>
    <h2 class="idea-title" contenteditable="true">${newIdea.title}</h2>
    <article class="delete-x"></article>
    <p class="idea-body" contenteditable="true">${newIdea.body}</p>
    <article class="upvote"></article>
    <article class="downvote"></article>
    <button class="completedBtn">Completed Task</button>
  </article>`);
  $('form').trigger("reset");
  $inputTitle.focus();
  toggleDisableState();
}

function populatingIdeas() {
  for (var i = 0; i < localStorage.length; i++) {
    var stringifiedObject = localStorage.getItem(localStorage.key(i));
    var idea = JSON.parse(stringifiedObject);
    $('.todo-list__ideas').prepend(`<article class="idea-cards" id=${idea.key}>
      <p class = "checkMark">&#x02713</p>
      <h2 class="idea-title" contenteditable="true">${idea.title}</h2>
      <article class="delete-x" aria-label="Button to delete idea"></article>
      <p class="idea-body" contenteditable="true">${idea.body}</p>
      <article class="upvote"></article>
      <article class="downvote"></article>
      <button class="completedBtn">Completed Task</button>
      </article>`);
  }
}

function sendToStorage(idea) {
  var stringifiedIdea = JSON.stringify(idea);
  localStorage.setItem(idea.key, stringifiedIdea)
}

function toggleDisableState() {
  var $inputTitle = $('.todo-form__input-title');
  var $inputBody = $('.todo-form__input-body');
  var $saveBtn = $('.todo-form__button-save');
  if ($inputBody.val() && $inputTitle.val()) {
    $saveBtn.prop('disabled', false);
  } else {
    $saveBtn.prop('disabled', true);
  }
}

function deleteIdeas() {
  $(this).closest('.idea-cards').fadeOut();
  var key = $(this).closest('.idea-cards').attr('id');
  localStorage.removeItem(key);
}

function changeReadClass(ev) {
  $(this).closest('.checkMark').toggleClass('checkMarkActive');
  if ('checkMarkActive') {
    $(this).closest('.idea-cards').toggleClass('idea-cards-read');
  }
}

function sortCompleted(){
 var showCompleted = $('.completedTask').text();
 if(showCompleted === "Show completed tasks"){
  $('.completedTask').text('Show All');
  var cards = $('.idea-cards').hide();
  var completed = $('.idea-cards-read').show();
} else{
  $('.completedTask').text('Show completed tasks');
   var cards = $('.idea-cards').show();
   var completed = $('.idea-cards-read').hide();
 }
}

function changeStorageQuality(newthis) {
  var key = $(newthis).closest('.idea-cards').attr('id');
  var idea = localStorage.getItem(key);
  idea = JSON.parse(idea);
  idea.quality = $(newthis).siblings('h3').text();
  var stringifiedIdea = JSON.stringify(idea);
  localStorage.setItem(key, stringifiedIdea);
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
//   var $inputTitle = $('.todo-form__input-title');
//   if (e.keyCode === 13) {
//     e.preventDefault();
//     $inputTitle.focus();
//   }
//   var id = $(this).closest('.idea-cards').attr('id');
//   var idea = localStorage.getItem(id);
//   idea = JSON.parse(idea);
//   idea.title = $(this).text();
//   idea.body = $(this).text();
//   var stringifiedIdea = JSON.stringify(idea);
//   localStorage.setItem(id, stringifiedIdea);
// }

function searchIdeas() {
  var $input = $('.todo-list__search-field').val();
  $input = $input.toUpperCase();
  var card = $('.idea-cards');
  for (i = 0; i < card.length; i++) {
    var title = $(card[i]).find('.idea-title').text().toUpperCase();
    var body = $(card[i]).find('.idea-body').text().toUpperCase();
    var quality = $(card[i]).find('.quality').text().toUpperCase();
    quality = quality.replace('QUALITY: ', '');
    if (title.includes($input) || body.includes($input) || quality.includes($input)) {
      $(card[i]).show();
    } else {
      $(card[i]).hide();
    }
  }
}