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
    'None',
    'Low',
    'Normal',
    'High',
    'Critical'
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
              <button class="2 normal" type="button"><i class="fas fa-flag"></i>
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
}

function populatingIdeas() {
  for (var i = 0; i < localStorage.length; i++) {
    var stringifiedObject = localStorage.getItem(localStorage.key(i));
    var newIdea = JSON.parse(stringifiedObject);
    $('.todo-list__ideas').prepend(`<article class="idea-cards" id="${newIdea.key}">
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
          <button class="0 none" type="button"><i class="far fa-flag"></i></i>
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
  </article>`);
    if (newIdea.completed === true) {
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
  var key = $(newthis).closest('.idea-cards').attr('id');
  var idea = localStorage.getItem(key);
  idea = JSON.parse(idea);
  if (idea.importanceValue > 0 && idea.importanceValue <=5 ) {
    idea.importanceValue = idea.importanceValue + 1;
  }
  $(this).parent().siblings('.flags button')

  if button class === idea.importanceValue

  // border: 1.5px solid #00a79c;
  // border-radius: 5px;
  //     background-color: #eee;
  var stringifiedIdea = JSON.stringify(idea);
  localStorage.setItem(key, stringifiedIdea);

  // changeStorageQuality(this)
}

function downvoteIdea() {
  if ($(this).siblings('h3').text() === 'quality: genius') {
    $(this).siblings('h3').text('quality: plausible')
  } else if ($(this).siblings('h3').text() === 'quality: plausible') {
    $(this).siblings('h3').text('quality: swill')
  }
  // changeStorageQuality(this)
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