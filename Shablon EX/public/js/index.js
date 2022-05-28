console.log('ok');
const { postForm } = document.forms;

const postWrapper = document.querySelector('.postWrapper');

function newPost(post) {
  return `
  
    <div data-id="${post.id}" class="col-4">
    <div class="card" style="width: 18rem;">
        <img src="/img/${post.img}" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${post.title}</h5>
            <p class="card-text">${post.body}</p>
            
            <button id="del-post" type="button">Delete</button>
            <button id="edit-post" type="button">Update</button>
            
        </div>
    </div>
    </div>
    
    `;
}

function editInput(data) {
  return `
  <form id="editFormItem" data-id=${data.id}  name="postForm">
    <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input type="text" class="form-control" id="title" name="title" value = ${data.title}>
    </div>
     <div class="mb-3">
        <label for="body" class="form-label">Body</label>
        <input type="text" class="form-control" id="body" name="body" value = ${data.body}>
    </div>
    <div class="mb-3">
        <label for="img" class="form-label">img</label>
        <input type="file" class="form-control" id="img" name="img">
    </div>
    <button name="sub" id=${data.id} type="submit" class="btn btn-primary">Send</button>
</form>
  `;
}

postForm.addEventListener('submit', async (e) => {
  if (e.target.name === 'postForm') {
    e.preventDefault();
    const data = new FormData(postForm);
    const response = await fetch('/post', {
      method: 'POST',
      body: data,
    });
    if (response.ok) {
      const dataFromBack = await response.json();
      postWrapper.insertAdjacentHTML('afterbegin', newPost(dataFromBack.newPost));
    }
  }
  // console.log(e.target);
});

postWrapper.addEventListener('click', async (e) => {
  if (e.target.id === 'del-post') {
    console.log('------start----');
    e.preventDefault();
    const card = e.target.closest('[data-id]');
    const { id } = card.dataset;
    console.log('------card id---- ', card, id);

    const response = await fetch(`/post/${id}`, {
      method: 'DELETE',
    });
    console.log('------response----', response);

    if (response.ok) {
      card.remove();
    }
  } else if (e.target.id === 'edit-post') {
    const card = e.target.closest('[data-id]');
    const { id } = card.dataset;
    const response = await fetch(`/post/${id}`);
    const data = await response.json();
    console.log(data);
    if (!document.getElementById('editFormItem')) {
      card.insertAdjacentHTML('beforeend', editInput(data));
    } else {
      document.getElementById('editFormItem').remove();
    }
  }
});

postWrapper.addEventListener('submit', async (e) => {
  if (e.target.id === 'editFormItem') {
    e.preventDefault();
    const formData = new FormData(e.target); // собираем данные с формы

    const { id } = e.target.dataset; // получаем id карточки для обновления

    const response = await fetch(`/put/${id}`, { // отправляем фетч на ручку /put/:id
      method: 'PUT',
      body: formData,
    });

    if (response.ok === true) {
      const dataFromBack = await response.json();

      const allDiv = e.target.parentNode; // это весь div вместе с формочкой для редактирования
      console.log(allDiv);
      allDiv.innerHTML = updateCard(dataFromBack.result);
    }
  }
});

function updateCard(obj) {
  return `            
          <div class="card" style="width: 18rem;">
              <img src="/img/${obj.img}" class="card-img-top" alt="...">
              <div class="card-body">
                  <h5 class="card-title">${obj.title}</h5>
                  <p class="card-text">${obj.body}</p>
                  <button id="del-post" type="button">Delete</button>
                  <button id ="edit-post" type="button">Update</button>
                  <button id ="like-post" type="button">❤️  <span>0</span> Likes</button>
              </div>
          </div>`;
}
