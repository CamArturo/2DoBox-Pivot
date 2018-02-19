$('.todo-form__input-title').on('keyup', toggleDisableState);
$('.todo-form__input-body').on('keyup', toggleDisableState);
$('.todo-list__search-field').on('keyup', searchIdeas);
$('.todo-form__button-save').on('click', saveIdea);
$('.todo-list__ideas').on('click', '.delete-x', deleteIdeas);
$('.todo-list__ideas').on('click', '.upvote', upvoteIdea);
$('.todo-list__ideas').on('click', '.downvote', downvoteIdea);
$('.todo-list__ideas').on('click', '.checkMark', changeReadClass);
$('.todo-list__ideas').on('keyup blur', function (event) {
  saveUpdates(event);
});
$('.completedTask').on('click', sortCompleted);
$('.todo-list__ideas').on('keydown blur', '.idea-title', disableEditable);
$('.todo-list__ideas').on('keydown blur', '.idea-body', disableEditable);
$('.todo-list__ideas').on('click', '.idea-title', enableEditable);
$('.todo-list__ideas').on('click', '.idea-body', enableEditable);

populatingIdeas();

function disableEditable() {
  if (event.keyCode === 13 || event.type === 'focusout') {
    $(this).attr('contentEditable', false);
  }

}

function enableEditable() {
  $(this).attr('contentEditable', true);

}

function saveUpdates(ev) {
  var ideaElement = ev.target.closest('.idea-cards');
  var updatedIdea = new existingIdea(ideaElement);
  sendToStorage(updatedIdea);
}

function existingIdea(el) {
  //this.levelsImportance = $(el).find('?').text();
  this.key = el.id;
  this.title = $(el).find('.idea-title').text();
  this.body = $(el).find('.idea-body').text();
  this.completed = el.classList.contains('idea-cards-read');
  //this.importanceValue = $(ideaElement).find('?').text();
}

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
      </article>`);
    if (idea.completed === true) {
      var ideaEl = document.getElementById(idea.key);
      ideaEl.classList.add("idea-cards-read");
      ideaEl.querySelector('.checkMark').classList.add('checkMarkActive');
    }
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

function sortCompleted() {
  var showCompleted = $('.completedTask').text();
  if (showCompleted === "Show completed tasks") {
    $('.completedTask').text('Show All');
    var cards = $('.idea-cards').hide();
    var completed = $('.idea-cards-read').show();
  } else {
    $('.completedTask').text('Show completed tasks');
    var cards = $('.idea-cards').show();
    var completed = $('.idea-cards-read').hide();
  }
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