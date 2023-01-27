const header = document.querySelector("header");
const menuIcon = document.querySelector(".menu-icon");
const menu = document.querySelector("nav");
const discoverItems = document.querySelectorAll(".discover-items");
const stats = document.querySelectorAll(".stat > .value");
const heroSlideUpBtn = document.querySelectorAll(
  ".hero-area [data-animate~=btn-slide-up]"
);
const discoverSlideElems = document.querySelectorAll(
  ".discover [data-animate~=slide-up]"
);
const majorSlideElems = document.querySelectorAll(
  ".major [data-animate~=slide-up]"
);
const majorSlideRightElems = document.querySelectorAll(
  ".major [data-animate~=slide-right]"
);
const bonusScaleElems = document.querySelectorAll(
  ".bonus [data-animate~=scale-up]"
);
const degreesSlideElems = document.querySelectorAll(
  ".degrees [data-animate~=slide-up]"
);
const eventsSlideElems = document.querySelectorAll(
  ".events [data-animate~=slide-right]"
);
let headerInLandingPage = true;

// ---Menu toggling---
menuIcon.addEventListener("click", (e) => {
  e.preventDefault();
  menu.classList.toggle("open");
  if (!headerInLandingPage) header.classList.toggle("opaque");
});
// ---Disable some links---
document.querySelectorAll(".link-disabled").forEach((e) =>
  e.addEventListener("click", (e) => {
    e.preventDefault();
    showNotif(
      false,
      "Server On Holiday",
      "The page is not broken, the school's developers are currently taking a break.",
      5000
    );
  })
);
// ---discover section hover animations---
discoverItems.forEach((item) => {
  item.addEventListener("mouseover", () => {
    discoverItems.forEach((e) => {
      if (e !== item) e.classList.add("not-hover");
    });
  });
  item.addEventListener("mouseleave", () => {
    discoverItems.forEach((e) => e.classList.remove("not-hover"));
  });
});

// ---intersectionObserver for elem reveal animation on scroll---
createObserver("#hero-area", {
  func: (intersecting) => {
    header.classList.toggle("opaque", !intersecting);
    headerInLandingPage = intersecting;
    if (menu.classList.contains("open")) header.classList.remove("opaque");
  },
  observeOnce: false,
  headerNavBug: true,
  thresholdValue: 0.25,
});
createObserver("#stats", {
  func: typeLetter,
  observeOnce: true,
  thresholdValue: 0.25,
});
createObserver("#stats", {
  func: statsCounter.bind(null, stats, {
    endDigitRange: [
      [50, 65],
      [200, 230],
      [880, 930],
      [70, 85],
    ],
    symbol: ["%", "k", "k", "k"],
    decimal: [0, 1, 1, 0],
    speed: 100,
  }),
  observeOnce: true,
  thresholdValue: 1.0,
});

createObserver("#hero-area", {
  func: () => heroSlideUpBtn.forEach((each) => each.classList.add("animate")),
  observeOnce: true,
  thresholdValue: 0,
});
createObserver("#discover", {
  func: () =>
    discoverSlideElems.forEach((each) => each.classList.add("animate")),
  observeOnce: true,
  thresholdValue: 0.1,
});
createObserver("#major", {
  func: () => majorSlideElems.forEach((each) => each.classList.add("animate")),
  observeOnce: true,
  thresholdValue: 0.2,
});
createObserver("#major", {
  func: () =>
    majorSlideRightElems.forEach((each) => each.classList.add("animate")),
  observeOnce: true,
  thresholdValue: 0.2,
});
createObserver("#bonus", {
  func: () => bonusScaleElems.forEach((each) => each.classList.add("animate")),
  observeOnce: true,
  thresholdValue: 0.2,
});
createObserver("#degrees", {
  func: () =>
    degreesSlideElems.forEach((each) => each.classList.add("animate")),
  observeOnce: true,
  thresholdValue: 0.4, //change back to 0.3 after testing
});
createObserver("#events", {
  func: () => eventsSlideElems.forEach((each) => each.classList.add("animate")),
  observeOnce: true,
  thresholdValue: 0.3,
});
createObserver("#album", {
  func: () => {
    const typeAlbumText = new Typed(document.querySelector(".album-title"), {
      strings: ["MEMORIES"],
      typeSpeed: 180,
      showCursor: false,
      loop: false,
      onComplete: () =>
        document.querySelector(".album-title").classList.add("animate"),
    });
  },
  observeOnce: true,
  thresholdValue: 0.5,
});

// ---University statistics counter function---
function statsCounter(arrOfElems, options) {
  arrOfElems.forEach((elem, index) => {
    const rand = (min, max) => Math.floor(Math.random() * (max - min)) + min;
    const symbol = options["symbol"][index];
    const endDigitRange = options["endDigitRange"][index];
    const endValue = rand(...endDigitRange);
    const speed = options["speed"] + 1.23;
    const increment = endValue / speed;
    const decimal = options["decimal"][index];
    let startValue = 0;

    let timer = setInterval(() => {
      startValue += increment;
      elem.innerText = `${startValue.toFixed(decimal)}${symbol}`;

      if (startValue >= endValue) clearInterval(timer);
    }, 10);
  });
}
// ---Creates all Intersection observer used---
function createObserver(elemID, options) {
  const elem = document.querySelector(elemID);
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // This "if statement" should not be included if this function is reused in a different website
        if (options.headerNavBug) {
          options.func(entry.isIntersecting);
          return;
        }

        if (entry.isIntersecting) {
          options.func();
          if (options.observeOnce) observer.unobserve(entry.target);
        }
      });
    },
    { threshold: options.thresholdValue }
  );

  observer.observe(elem);
}

// ---Infinite Sliding---
const sliderContents = document.getElementsByClassName("program");
let currentSlideIndex = 0;

function goToSlide(currentSlideIndex) {
  [...sliderContents].forEach(
    (each, i) =>
      (each.style.transform = `translateX(${(i - currentSlideIndex) * 100}%)`)
  );

  readyNextSlide();
}
function readyNextSlide() {
  const lastSlideIndex = sliderContents.length - 1;

  if (currentSlideIndex === lastSlideIndex) {
    document.querySelector(".programs").append(sliderContents[0]);
    sliderContents[lastSlideIndex].style.transform = `translateX(100%)`;
    currentSlideIndex--;
  }

  if (currentSlideIndex === 0) {
    document.querySelector(".programs").prepend(sliderContents[lastSlideIndex]);
    sliderContents[0].style.transform = `translateX(-100%)`;
    currentSlideIndex++;
  }
}
goToSlide(currentSlideIndex);
document
  .querySelector(".prev")
  .addEventListener("click", () => goToSlide(--currentSlideIndex));
document
  .querySelector(".next")
  .addEventListener("click", () => goToSlide(++currentSlideIndex));

// ---Typewriting For Letter---
function typeLetter() {
  const letterToStudent =
    '<div class="content"><div class="text-box"><img src="/img/official.svg" alt=""><p class="sub-title">FROM THE CHAOTIC DESK OF THE CHANCELLOR</p></div><form action=""><p class="para"><label>Hello, future <select class="selection"><option value="null" selected></option><option value="Undergraduate">Undergraduate</option><option value="graduate">graduate</option><option value="postgraduate">postgraduate</option><option value="slacker">slacker</option></select>! Are you fed up of the traditional university experience and ready for something a little more... relaxed? If so, then Slacker University is where you belong!</label></p><p class="para"><label>You may think you&#39;re just an average <select class="selection"><option value="null" selected></option><option value="student">student</option><option value="gamer">gamer</option><option value="lazy-bone">lazy-bone</option><option value="party animal">party animal</option></select>, but at this University, we see potential in you. </label><label>We&#39;re a community of fun-loving individuals that knows how to have a good time and still get our <select class="selection"><option value="null" selected></option><option value="degrees">degrees</option><option value="diplomas">diplomas</option><option value="certificate">certificate</option><option value="badge of honor">badge of honor</option></select>.</label></p><p class="para"><label>SLACKER UNIVERSITY: WHERE PROCRASTINATION IS A VIRTUE are pleased to inform you, a <select class="selection"><option value="null" selected></option><option value="18+">18+</option><option value="25+">25+</option><option value="35+">35+</option><option value="50+">50+</option></select> <select class="selection"><option value="null" selected></option><option value="male">male</option><option value="female">female</option></select></label><label>is invited to join us at Slacker University&#39;s <select class="selection"><option value="null" selected></option><option value="great hall">great hall</option><option value="party central">party central</option><option value="fun factory">fun factory</option><option value="gamers lounge">gamers lounge</option><option value="food town">food town</option></select></label><label> and let your <select class="selection"><option value="null" selected></option><option value="creative side">creative side</option><option value="inner gamer">inner gamer</option><option value="inner gluttony">inner gluttony</option><option value="love of parties">love of parties</option><option value="love of doing nothing">love of doing nothing</option></select> shine. </label><label>Remember, you are among the few elites chosen to partake in the extraordinary education and blissful experience that this prestigious University has to offer.</label></p><p class="para"><label>But don&#39;t worry, we didn&#39;t forget about the whole "getting an education" thing. Even with all the fun and merriment, you&#39;ll still get your full academic degree and study just a tiny little bit. Just enough to keep your <select class="selection"><option value="null" selected></option><option value="parents">parents</option><option value="guardian">guardian</option></select> off your back, you know.</label></p><p class="para"><label>At Slacker U, we don&#39;t just tolerate laziness - we embrace it. Our students are the kings and queens of procrastination, the masters of doing nothing. But don&#39;t think that means we don&#39;t have any fun - oh no, quite the opposite. Whether you&#39;re into<select class="selection"><option value="null" selected></option><option value="creating">creating</option><option value="gaming">gaming</option><option value="partying">partying</option><option value="flirting">flirting</option><option value="having fun">having fun</option><option value="doing nothing">doing nothing</option></select>, we&#39;ve got something for you.</label></p><p class="para"><label>So let&#39;s break you out of your <select class="selection"><option value="null" selected></option><option value="regular university">regular university</option><option value="boring life">boring life</option><option value="9-5 grind">9-5 grind</option><option value="seriousness jail">seriousness jail</option></select> and join the ranks of the ultimate slackers to ever walk this planet. </label><label>We can&#39;t wait to see what the future holds for you at Slacker University. Consider Accepting this invitation and join us on this magnificent journey.</label></p><div class="btn-box"><button class="accept" type="submit" id="accept">Accept</button></div></form></div>';

  const typingOptions = {
    strings: [letterToStudent],
    typeSpeed: 15,
    showCursor: false,
    loop: false,
    onComplete: () => {
      document.querySelector(".veil").remove();
      showNotif(
        true,
        "Go On",
        "You can interact with the Official Letter now.",
        4000
      );
      document.querySelector("#accept").addEventListener("click", (e) => {
        e.preventDefault();
        showNotif(
          true,
          "INVITATION ACCEPTED",
          " We'd Contact you in a week's time. BE PREPARED!",
          5000
        );
      });
    },
  };

  const typed = new Typed(document.querySelector("#typed"), typingOptions);
  document.querySelector(".letter").classList.add("animate");
  document.querySelector(".letter").addEventListener("click", () => {
    if (!typed.typingComplete) {
      showNotif(
        false,
        "Where Are Your Manners?",
        "The School's Chancellor is composing a message, Wait till he's done.",
        4000
      );
    }
  });

  createObserver("#events", {
    func: () => typed.stop(),
    observeOnce: true,
    thresholdValue: 0.3,
  });
}

// ---Creates Notifications---
function showNotif(isError, notifHead, notifInfo, timer) {
  let notification = document.querySelector(".notif");

  document.querySelector(".notif-head").innerHTML = notifHead;
  document.querySelector(".notif-info").innerHTML = notifInfo;
  !isError
    ? notification.classList.add("error")
    : notification.classList.remove("error");

  if (!notification.classList.contains("show")) {
    notification.classList.add("show");
    setTimeout(() => {
      notification.classList.remove("show");
    }, timer);
  }
}
