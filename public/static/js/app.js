document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('nav');
    if (window.scrollY === 0) {
      nav.classList.remove('nav-hide');
    } else {
      nav.classList.add('nav-hide');
    }
  });

  const commentBox = document.getElementById('addComment');
  commentBox &&
    commentBox.addEventListener('input', e => {
      if (e.target.scrollHeight <= 76) {
        commentBox.style.overflow = 'auto';
        autosize(commentBox);
      }
    });
});

const convertValues = value => {
  if (value >= 1000000000) {
    value = `${value / 1000000000}b`;
  } else if (value >= 1000000) {
    value = `${value / 1000000}m`;
  } else if (value >= 1000) {
    value = `${value / 1000}k`;
  }
  return value;
};

// console.log(convertValues(80000000000));

const periods = {
  month: 30 * 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000
};

const formatTime = timeCreated => {
  const diff = now_utc() - timeCreated
  console.log(diff)

  if (diff > periods.month) {
    console.log('1')
    return `${Math.floor(diff / periods.month)}m ago`;
  } else if (diff > periods.week) {
    console.log('2')
    return `${Math.floor(diff / periods.week)}w ago`;
  } else if (diff > periods.day) {
    console.log('3')
    return `${Math.floor(diff / periods.day)}d ago`;
  } else if (diff > periods.hour) {
    console.log('4')
    return `${Math.floor(diff / periods.hour)}h ago`;
  } else if (diff > periods.minute) {
    console.log('5')
    return `${Math.floor(diff / periods.minute)}m ago`;
  }
  return 'Just now';
};

const monInd = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12" };

const post_createds = document.getElementsByClassName('post-created')
for (const post_created of post_createds) {
  if (post_created) {
    const time_stamp = post_created.innerText;

    // created utc
    const t_date = new Date(time_stamp)

    console.log('FORMATTING...')
    const ff = formatTime(t_date)
    console.log(ff)
    post_created.innerText = formatTime(t_date)
  }

}

function utc_to_naive(utc_str) {
  const arr = utc_str.split(' ')
  return `${arr[3]}-${monInd[arr[2]]}-${arr[1]}T${arr[4]}.000000`
}
// console.log(formatTime('2020-01-29T13:01:56.446Z'));

function now_utc() {
  // now naive
  const now_date = new Date()
  const time_stamp_now = utc_to_naive(now_date.toUTCString())
  return new Date(time_stamp_now)
}