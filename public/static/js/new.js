/**
 * Event handler for a form submit event.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event
 *
 * @param {SubmitEvent} event
 */
async function handleFormSubmit(event) {
	event.preventDefault();

	const form = event.currentTarget;
	const url = form.action;



	try {
		const formData = new FormData(form);
		const responseData = await postFormDataAsMultipart({ url, formData });
        console.log(responseData)

		window.location.replace(`/profiles/${formData.get('username')}`)
	} catch (error) {
		console.error(error);
	}
}

async function postFormDataAsMultipart({ url, formData }) {
	// const plainFormData = Object.fromEntries(formData.entries());
	// const formDataJsonString = JSON.stringify(plainFormData);


	const fetchOptions = {
		mode: "cors",
		method: "POST",
		body: formData,
		credentials: "include"
	};

	const response = await fetch(url, fetchOptions);

	if (!response.ok) {
		const errorMessage = await response.text();
		throw new Error(errorMessage);
	}

	return response.json();
}


const editForm = document.getElementById("edit-form");
// editForm.addEventListener("submit", handleFormSubmit);
editForm.addEventListener("submit", handleFormSubmit)