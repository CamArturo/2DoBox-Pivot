$('.todo-form__input-title').on('keyup', toggleDisableState);
$('.todo-form__input-body').on('keyup', toggleDisableState);
$('.todo-list__search-field').on('keyup', searchIdeas);
$('.todo-form__button-save').on('click', saveIdea);
$('.todo-list__ideas').on('click', '.delete-x', deleteIdeas);
$('.todo-list__ideas').on('click', '.upvote', upvoteIdea);
$('.todo-list__ideas').on('click', '.downvote', downvoteIdea);
$('.todo-list__ideas').on('click', '.checkMark', changeReadClass);
$('.todo-list__ideas').on('keyup', '.idea-title', saveUpdates);
$('.todo-list__ideas').on('keyup', '.idea-body', saveUpdates);
$('.completedTask').on('click', sortCompleted);
$('.todo-list__ideas').on('keydown blur', '.idea-title', disableEditable);
$('.todo-list__ideas').on('keydown blur', '.idea-body', disableEditable);
$('.todo-list__ideas').on('click', '.idea-title', enableEditable);
$('.todo-list__ideas').on('click', '.idea-body', enableEditable);

populatingIdeas();
showTen();

function saveUpdates(event) {
  console.log('save updates fired');
  var ideaElement = event.target.closest('.idea-cards');
  var key =  $(this).closest('.idea-cards').attr('id');
  var idea = JSON.parse(localStorage.getItem(key));
  if ($(this).hasClass('idea-title')) {
    idea.title = $(this).closest('.idea-title').text();
  } else {
    idea.body = $(this).closest('.idea-body').text();
  }
  this.completed = ideaElement.classList.contains('idea-cards-read');
  sendToStorage(key, idea);
}

function showTen(){
  var card = $('.idea-cards');
  for(i = 0; i <= card.length; i++){
    if(card.length >= 10){
      $('.idea-cards').slice(10).hide();
    }
  }
}

function Idea(key, ideaTitleValue, ideaBodyValue) {
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
  sendToStorage(key, newIdea);
  $('.todo-list__ideas').prepend(`
  <article class="idea-cards" id="${newIdea.key}">
    <p class = "checkMark">&#x02713</p>
    <h2 class="idea-title" contenteditable="true">${newIdea.title}</h2>
    <article class="delete-x"></article>
    <p class="idea-body" contenteditable="true">${newIdea.body}</p>
    <section class="icons">
      <section class="vote-buttons">
        <article class="upvote"></article>
        <article class="downvote"></article>
      </section>
      <section class="flags">
          <button class="0 " type="button"><i class="far fa-flag"></i>
          </button>
              <button class="1 low" type="button"><i class="fas fa-flag"></i>
          </button>
              <button class="2 normal selected-flag" title="Normal" type="button"><i class="fas fa-flag"></i>
          </button>
              <button class="3 high" type="button"><i class="fas fa-flag"></i>
          </button>
              <button class="4 critical" type="button"><i class="fas fa-flag"></i>
          </button>
      </section>
    </section>
  </article>`);
  $('form').trigger("reset");
  $inputTitle.focus();
  toggleDisableState();
  showTen();
}

function populatingIdeas() {
  for (var i = 0; i < localStorage.length; i++) {
    var stringifiedObject = localStorage.getItem(localStorage.key(i));
    var newIdea = JSON.parse(stringifiedObject);
    var selectFlagNum = newIdea.importanceValue;
    var articleTemplate = `<article class="idea-cards" class="" id="${newIdea.key}">
    <p class = "checkMark">&#x02713</p>
    <h2 class="idea-title" contenteditable="true">${newIdea.title}</h2>
    <article class="delete-x"></article>
    <p class="idea-body" contenteditable="true">${newIdea.body}</p>
    <section class="icons">
      <section class="vote-buttons">
        <article class="upvote"></article>
        <article class="downvote"></article>
      </section>
      <section class="flags">
          <button class="0 none" title="None" type="button"><i class="far fa-flag"></i></i>
          </button>
              <button class="1 low" type="button"><i class="fas fa-flag"></i>
          </button>
              <button class="2 normal" type="button"><i class="fas fa-flag"></i>
          </button>
              <button class="3 high" type="button"><i class="fas fa-flag"></i>
          </button>
              <button class="4 critical" type="button"><i class="fas fa-flag"></i>
          </button>
      </section>
    </section>
  </article>`;
    $('.todo-list__ideas').prepend(articleTemplate);
    $( $('.flags button')[selectFlagNum] ).addClass('selected-flag');
    // if (newIdea.completed) {
    //   $('.idea-cards').addClass('idea-cards-read');
    // }

    if (newIdea.completed === true) {
      var ideaEl = document.getElementById(newIdea.key);
      ideaEl.classList.add("idea-cards-read");
      ideaEl.querySelector('.checkMark').classList.add('checkMarkActive');
      $('.idea-cards-read').hide()
    }
  }
}

function sendToStorage(key, idea) {
  console.log(idea);
  var stringifiedIdea = JSON.stringify(idea);
  localStorage.setItem(key, stringifiedIdea)
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
  showTen();
}

function changeReadClass(ev) {
  var key =  $(this).closest('.idea-cards').attr('id');
  var idea = JSON.parse(localStorage.getItem(key));

  $(this).closest('.checkMark').toggleClass('checkMarkActive');
  $(this).closest('.idea-cards').toggleClass('idea-cards-read');

  if ($(this).closest('.checkMark').hasClass('checkMarkActive')) {
    idea.completed = true;
  } else {
    idea.completed = false;
  }
  sendToStorage(key, idea);
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

function upvoteIdea(event) {
  var key =  $(this).closest('.idea-cards').attr('id');
  var idea = JSON.parse(localStorage.getItem(key));
  if (idea.importanceValue >= 0 && idea.importanceValue <= 3) {
    idea.importanceValue += 1;
    $(this).parent().next().find('.selected-flag').next().addClass('selected-flag');
    $(this).parent().next().find('.selected-flag').first().removeClass('selected-flag');
  }
  localStorage.setItem(key, JSON.stringify(idea));
}

function downvoteIdea(event) {
  var key =  $(this).closest('.idea-cards').attr('id');
  var idea = JSON.parse(localStorage.getItem(key));
  if (idea.importanceValue >= 1 && idea.importanceValue <= 4) {
    idea.importanceValue -= 1;
    $(this).parent().next().find('.selected-flag').prev().addClass('selected-flag');
    $(this).parent().next().find('.selected-flag').last().removeClass('selected-flag');
  }
  localStorage.setItem(key, JSON.stringify(idea));
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

function disableEditable() {
  if (event.keyCode === 13 || event.type === 'focusout') {
    $(this).attr('contentEditable', false);
  }
}

function enableEditable() {
  $(this).attr('contentEditable', true);
}