document.addEventListener("DOMContentLoaded", function() {
    // Sample destinations data
    const destinations = [
        { 
          name: "Great Barrier Reef", 
          thumbnail: "great_barrier_reef.jpg",
          description: "The Great Barrier Reef is the world's largest coral reef system, composed of over 2,900 individual reefs and 900 islands stretching for over 2,300 kilometers. It's one of the most renowned destinations for diving and snorkeling enthusiasts, offering an unparalleled underwater experience."
        },
        { 
          name: "Gold Coast", 
          thumbnail: "gold_coast.jpg",
          description: "The Gold Coast is a vibrant city renowned for its beautiful beaches, thriving nightlife, and world-class surfing spots. With a blend of natural beauty and urban excitement, it offers an array of attractions including theme parks, shopping precincts, and lush hinterland areas."
        },
        { 
          name: "Sunshine Coast", 
          thumbnail: "sunshine_coast.jpg",
          description: "The Sunshine Coast is a coastal region known for its laid-back atmosphere, pristine beaches, and stunning hinterland landscapes. It's a popular destination for outdoor activities such as surfing, hiking, and exploring the charming coastal towns."
        },
        { 
          name: "Fraser Island", 
          thumbnail: "fraser_island.jpg",
          description: "Fraser Island, located off the southeastern coast of Queensland, is the largest sand island in the world. With its unique ecosystem of freshwater lakes, lush rainforests, and sandy beaches, it's a UNESCO World Heritage site and a paradise for nature lovers and adventure seekers."
        },
        { 
          name: "Daintree Rainforest", 
          thumbnail: "daintree_rainforest.jpg",
          description: "The Daintree Rainforest is a primeval forest in Queensland, Australia, dating back over 180 million years. It's one of the oldest tropical rainforests on Earth and is home to an incredible diversity of plants and animals, including rare and endemic species."
        },
        { 
          name: "Kuranda", 
          thumbnail: "kuranda.jpg",
          description: "Kuranda is a picturesque village nestled in the rainforest of Far North Queensland. Known for its vibrant arts and crafts scene, scenic railway, and stunning natural surroundings, it's a popular destination for day trips and eco-tourism adventures."
        },
        { 
          name: "Brisbane", 
          thumbnail: "brisbane.jpg",
          description: "Brisbane is the capital city of Queensland, renowned for its sunny climate, outdoor lifestyle, and cultural diversity. It offers a mix of modern skyscrapers and historic buildings, along with lush parks, riverside promenades, and a thriving culinary scene."
        },
        { 
          name: "Cairns", 
          thumbnail: "cairns.jpg",
          description: "Cairns is a vibrant tropical city located in Far North Queensland, serving as the gateway to the Great Barrier Reef and the Daintree Rainforest. With its waterfront esplanade, lively markets, and abundance of adventure activities, it's a popular destination for tourists seeking both relaxation and excitement."
        },
        { 
          name: "Hamilton Island", 
          thumbnail: "hamilton_island.jpg",
          description: "Hamilton Island is the largest inhabited island in the Whitsunday Islands archipelago. Known for its luxury resorts, pristine beaches, and stunning coral reefs, it offers a range of activities including snorkeling, sailing, and wildlife encounters amidst breathtaking natural beauty."
        },
        { 
          name: "Whitsunday Islands", 
          thumbnail: "whitsunday_islands.jpg",
          description: "The Whitsunday Islands are a collection of 74 stunning islands located off the coast of Queensland, Australia. Known for their crystal-clear waters, pristine beaches, and diverse marine life, the Whitsundays are a popular destination for sailing, snorkeling, and relaxation."
        }
      ];
      
  
      const carousel = document.querySelector('.left .carousel');
    
      // Function to show the destination in left sidebars carousel
      function populateDestinations() {

        carousel.innerHTML = "";

        destinations.forEach(destination => {
          
          // console.log(destination)

          const destinationItem = document.createElement("div");

          destinationItem.classList.add("destination-item");
          destinationItem.innerHTML = `
            <img src="images/${destination.thumbnail}">
            <p>${destination.name}</p>
          `;
          carousel.appendChild(destinationItem);
            destinationItem.addEventListener("click", () => {
              showDestination(destination);
            });
        });
      }



// Function to display destination information and images
const aboutText = document.querySelector('.about-text');
const mainContent = document.querySelector('.main_content');

function showDestination(destination) {

  aboutText.style.display = 'none';

  mainContent.innerHTML = `
    <h2 class="destination_title">${destination.name}</h2>
    <p class="destination_description">${destination.description}</p>
    <br><hr><br>
    <div class="destination-images">
      <!-- Images from Flickr will be inserted here -->
    </div>
  `;


  // Mark selected destination visually // to hilight a selected destination
  const destinationItems = document.querySelectorAll('.destination-item');
  destinationItems.forEach(item => {
    item.classList.remove('selected');
  });
  event.target.closest('.destination-item').classList.add('selected');


  // Fetch images from Flickr
  const flickrAPIKey = '999025a979646c61a0b7f16fb9865522';
  const flickrEndpoint = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + flickrAPIKey + '&tags=' + destination.name+'&per_page=5&extras=description,date_taken,views,url_s,url_b,url_q,url_t,url_m,url_n,url_z,url_c,url_l,url_o&sort=interestingness-asc&format=json&nojsoncallback=1';


  fetch(flickrEndpoint)
  .then(response => response.json())
  .then(data => {
    console.log({data})
    const photos = data.photos.photo;

    const destinationImagesContainer = document.querySelector('.destination-images');


    photos.forEach(photo => {
  
      const thumbnailUrl = getPhotoUrls(photo).thumbnailUrl;
      const fullSizeUrl = getPhotoUrls(photo).fullSizeUrl;

      const imgElement = document.createElement('a');
      imgElement.href = fullSizeUrl;
      imgElement.classList.add('photo'); 
      imgElement.dataset.lightbox = destination.name;
      imgElement.dataset.title = photo.title || 'Untitled';
      
      const img = document.createElement('img');
      img.src = thumbnailUrl;

      
      const titleElement = document.createElement('div');
      titleElement.classList.add('photo-title');
      titleElement.textContent = photo.title+' - '+destination.name;
      
      const dateElement = document.createElement('div');
      dateElement.classList.add('photo-date');
      dateElement.textContent = formatDate(photo.datetaken);
      
      imgElement.appendChild(img);
      imgElement.appendChild(titleElement);
      imgElement.appendChild(dateElement);
      destinationImagesContainer.appendChild(imgElement);

      // imgElement.addEventListener('click',function () {
      //   handleClickOnPhoto(imgElement)
      // })

    });
  })
  .catch(error => {
    console.error('Error fetching Flickr images:', error);
  });


    // Initialize Lightbox2
    lightbox.option({
     'resizeDuration': 10,
     'wrapAround': true,
     'albumLabel': "Photo %1 of %2",
     'showImageNumberLabel':true,
     'fitImagesInViewport':true,
     'disableScrolling':true,
   });


  }  

// Function to get the appropriate photo URLs for thumbnail and modal full-size image with fallback
function getPhotoUrls(photo) {
  let thumbnailUrl = photo.url_s || photo.url_q || photo.url_t || photo.url_m || photo.url_n || photo.url_z || photo.url_c || photo.url_b;
  let fullSizeUrl = photo.url_b || photo.url_c || photo.url_z || photo.url_n || photo.url_m || photo.url_t || photo.url_q || photo.url_s;
  return { thumbnailUrl, fullSizeUrl };
}


// Function to format the date
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

    
      // Populate destinations carousel on page load
      populateDestinations();

});


// Initialize array to store recently viewed photos
let recentViews = [];

// Function to capture changes in image data
function captureImageChange(data) { 
  console.log('Image Changed')
  console.log(data); // Log the provided data for debugging

  const photoHref = data.link; // Using the provided link from data

  // Check if the clicked photo already exists in recentViews array
  const existingIndex = recentViews.findIndex(photoData => photoData.href === photoHref);

  // If the photo exists, remove it from its current position
  if (existingIndex !== -1) {
    recentViews.splice(existingIndex, 1);
  }

  const imgSrc = data.link; // Using the provided link from data

  const photoData = {
    href: photoHref,
    title: data.title,
    dateTaken: data.date_taken,
    imgSrc: imgSrc
  };

  // Add the clicked photo data to the beginning of the recentViews array
  recentViews.unshift(photoData);

  // Ensure recentViews array contains only up to 5 elements
  if (recentViews.length > 5) {
    recentViews.pop(); // Remove the oldest photo
  }

  // Update DOM to display recently viewed photos
  updateRecentViews();
}

// Function to update DOM with recently viewed photos
function updateRecentViews() {
  const recentViewsContainer = document.querySelector('.recent_views');
  recentViewsContainer.innerHTML = ''; // Clear previous contents

  recentViews.forEach(photoData => {
    const photoElement = document.createElement('a');
    photoElement.href = photoData.href;
    photoElement.dataset.lightbox = 'Recently Viewed';
    photoElement.dataset.title = photoData.title;
    photoElement.classList.add('photo'); 

    const img = document.createElement('img');
    img.src = photoData.imgSrc;
    img.title = photoData.title;

    photoElement.appendChild(img);
    recentViewsContainer.appendChild(photoElement);
  });
}
