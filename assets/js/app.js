//const BASE_URL = "http://localhost:3000";

//const API_BASE_URL = 'https://user-api-server.onrender.com';



$(document).ready(function () {
//Clinic Config
const clinicDomain = "user-api-server.onrender.com"; // غير هذا حسب العيادة الحالية
    
    $.ajax({
        url: `${API_BASE_URL}/api/clinics/${clinicDomain}`,
        method: "GET",
        success: function (data) {
          console.log("data of clinic config", data);
            $("#clinicName").text(data.name);
            $("#clinicLogo").attr("src", data.logo);
            $("body").css({
              "background-color": "red",
                "--primary-color": data.theme.primaryColor,
                "--secondary-color": data.theme.secondaryColor,
                "font-family": data.theme.font
            });

            $("#features").html(`
                <li>Online Booking: ${data.features.enableOnlineBooking ? "✅ Enabled" : "❌ Disabled"}</li>
                <li>Chat Support: ${data.features.enableChat ? "✅ Enabled" : "❌ Disabled"}</li>
            `);
        },
        error: function (err) {
            console.error("Error fetching clinic data:", err);
            $("#clinicName").text("❌ Error loading clinic data");
        }
    });


  // تهيئة i18next
  i18next
    .use(i18nextHttpBackend) // تحميل الترجمات من ملفات JSON
    .use(i18nextBrowserLanguageDetector) // اكتشاف لغة المتصفح
    .init({
      lng: localStorage.getItem("selectedLang") || "es", // استخدام اللغة المحفوظة أو الافتراضية
      fallbackLng: "en", // اللغة الاحتياطية
      debug: true,
      backend: {
        loadPath: `${API_BASE_URL}/locales/{{lng}}.json`, // مسار ملفات الترجمة
        // url: `${API_BASE_URL}/services`,

      }
    }, function (err, t) {
      if (err) return console.error("i18next error:", err);
      updateContent();
      updateLanguageButton(i18next.language);
    });

  // تحديث محتوى الصفحة بناءً على اللغة المحددة
  window.updateContent = function () {
    $("[data-i18n]").each(function () {
      let key = $(this).attr("data-i18n");
      $(this).text(i18next.t(key));
    });
  }

  // تحديث زر القائمة المنسدلة ليعكس اللغة المختارة
  window.updateLanguageButton = function (selectedLang) {
    let langText = { "es": "Español", "en": "English", "ar": "العربية" };
    $("#selectedLang").text(langText[selectedLang] || "Español");
  }

  // تغيير اللغة عند الاختيار
  window.changeLanguage = function (selectedLang) {
    console.log("Switching language to:", selectedLang);
    i18next.changeLanguage(selectedLang, function (err) {
      if (err) return console.error("Error changing language:", err);
      updateContent();
      updateLanguageButton(selectedLang);
      localStorage.setItem("selectedLang", selectedLang); // حفظ اللغة في localStorage
    });
  }

  // التعامل مع تغيير اللغة عند النقر على أي عنصر في القائمة
  $(".change-lang").on("click", function (e) {
    e.preventDefault();
    let selectedLang = $(this).data("lang");
    i18next.changeLanguage(selectedLang, function () {
        updateContent();
        updateLanguageButton(selectedLang);
        localStorage.setItem("selectedLang", selectedLang);
    });
  });

  // عند الضغط على زر الحجز
  $("#reservationButton").on("click", function () {
    alert(i18next.t("booking_message"));
  });


  //document.getElementById("consultationfullName").placeholder = i18next.t('enter_name');




  // $('#google-login').click(function () {
  //   $.ajax({
  //     url: '/api/auth/google',
  //     method: 'GET',
  //     success: function (response) {
  //       // معالجة الاستجابة هنا، مثل التوجيه إلى صفحة البروفايل أو تحديث واجهة المستخدم
  //       window.location.href = '/profile';
  //     },
  //     error: function (error) {
  //       console.error('Error logging in with Google', error);
  //     }
  //   });
  // });




  $('#google-login').click(function () {
    window.location.href = API_BASE_URL;
    // window.location.href = 'http://192.168.1.33:3000/api/auth/google';

  });

  $('#microsoft-login').click(function () {
    $.ajax({
      url: '/api/auth/microsoft',
      method: 'GET',
      success: function (response) {
        // معالجة الاستجابة هنا
        window.location.href = '/';
      },
      error: function (error) {
        console.error('Error logging in with Microsoft', error);
      }
    });
  });

  // Fetch services from the API using AJAX
  $.ajax({
    url: `${API_BASE_URL}/services`,
    method: 'GET',
    success: function (data) {
      if (data.length > 0) {
        //const lang = 'en';  // حدد اللغة التي تريد استخدامها، مثل 'ar' أو 'en'
        const lang = localStorage.getItem("selectedLang") || "en"; // الحصول على اللغة المختارة

        data.forEach(service => {
          console.log("service", service);

          // تحديد اللغة للعنوان والوصف
          const title = service.title[lang] || service.title['en']; // إذا كانت اللغة غير موجودة، استخدم 'en'
          const description = service.description[lang] || service.description['en']; // نفس الشيء للوصف
          const imageUrl = service.imageUrl;

          $('#servicesSection').append(`
            <div class="col">
              <div class="card" data-service-id="${service.serviceId}">
                <img src="${imageUrl}" class="card-img-top" alt="${title}">
                <div class="card-img-overlay d-flex justify-content-center align-items-center">
                  <h5 class="card-title text-white">${title}</h5>
                </div>
              </div>
            </div>
          `);
        });

        // إضافة حدث النقر للانتقال إلى صفحة الفئات
        $('.card').click(function () {
          const serviceId = $(this).data('service-id');
          window.location.href = `categories.html?serviceId=${serviceId}`; // توجيه المستخدم إلى صفحة الفئات
        });
      }
    },
    error: function (err) {
      console.error("Error fetching services:", err);
    }
  });

  // جعل الدالة متاحة عالميًا
  window.loadCategories = function (serviceId) {
    const lang = 'en';

    $.ajax({
      url: `${API_BASE_URL}/service/${serviceId}/categories`,
      method: 'GET',
      success: function (categories) {
        $('#categoriesSection').empty();

        categories.forEach(category => {
          const title = category.title[lang] || category.title['en'];
          const description = category.description[lang] || category.description['en'];
          const categoryId = category.categoryId;

          $('#categoriesSection').append(`
                  <div class="col-md-4 mb-4">
                      <div class="card category-card" data-category-id="${categoryId}">
                          <img src="${category.imageUrl}" class="card-img-top" alt="${title}">
                          <div class="card-body">
                              <h5 class="card-title">${title}</h5>
                              <p class="card-text">${description}</p>
                              <a href="javascript:void(0);" class="btn btn-primary">Read More</a>
                          </div>
                      </div>
                      <div class="row subcategories-container" id="subcategories-${categoryId}" style="display: none;"></div>
                  </div>
              `);
        });

        // عند الضغط على كارد الفئة
        $('.category-card').click(function (event) {
          event.preventDefault();  // لمنع التغيير في الرابط
          const categoryId = $(this).data('category-id');

          // إزالة الحدود الزرقاء من جميع الكروت وإخفاء الفئات الفرعية
          $('.category-card').removeClass('border-primary');
          $('.subcategories-container').slideUp();

          // إضافة الحدود الزرقاء للفئة المختارة وإظهار الفئات الفرعية
          $(this).addClass('border-primary');

          loadSubcategories(serviceId, categoryId);
        });
      },
      error: function (err) {
        console.error("Error fetching categories:", err);
      }
    });
  };


  // تحميل الفئات الفرعية
  window.loadSubcategories = function (serviceId, categoryId) {
    console.log("serviceId", serviceId);
    console.log("categoryId", categoryId);

    $.ajax({
      url: `${API_BASE_URL}/service/${serviceId}/category/${categoryId}/subcategories`,
      method: "GET",
      success: function (subcategories) {
        const subcategoriesContainer = $(`#subcategories-${categoryId}`);
        subcategoriesContainer.empty();

        // إضافة حاوية الفئات الفرعية التي تحتوي على الكروت
        subcategoriesContainer.append('<div class="subcategory-row">');

        subcategories.forEach((subcategory, index) => {
          // توزيع الكروت على صفوف مكونة من 3 كروت
          if (index % 3 === 0 && index !== 0) {
            subcategoriesContainer.append('</div><div class="subcategory-row">'); // إضافة صف جديد بعد 3 كروت
          }

          // إضافة الكرت الخاص بالفئة الفرعية
          subcategoriesContainer.append(`
          <div class="col-md-4 mb-4 mt-5">
            <div class="card subcategory-card" data-service-id="${serviceId}" data-category-id="${categoryId}" data-subcategory-id="${subcategory.subcategoryId}">
              <img src="${subcategory.imageUrl}" class="card-img-top" alt="${subcategory.title.en}" style="height: 36px; width: 40%; object-fit: cover;">
              <div class="card-body">
                <h6 class="card-title" style="font-size: 14px; font-weight: bold;">${subcategory.title.en}</h6>
                <p class="card-text" style="font-size: 12px; color: #555;">${subcategory.description.en}</p>
                <a href="subcategory.html?serviceId=${serviceId}&categoryId=${categoryId}&subcategoryId=${subcategory.subcategoryId}" class="btn btn-sm btn-primary">Read More</a>
              </div>
            </div>
          </div>
        `);
        });

        subcategoriesContainer.append('</div>'); // إغلاق الحاوية بعد إضافة كل الكروت

        // إظهار الفئات الفرعية تحت الفئة المختارة
        subcategoriesContainer.slideDown();

        // عند الضغط على فئة فرعية، يتم فتح صفحة جديدة
        $(".subcategory-card").click(function () {
          const serviceId = $(this).data("service-id");
          const categoryId = $(this).data("category-id");
          const subcategoryId = $(this).data("subcategory-id");

          // الانتقال إلى صفحة جديدة مع تمرير المعلومات في الرابط
          window.location.href = `subcategory.html?serviceId=${serviceId}&categoryId=${categoryId}&subcategoryId=${subcategoryId}`;
        });
      },
      error: function (err) {
        console.error("Error fetching subcategories:", err);
      },
    });
  };


  function loadSubcategoryDescription(serviceId, categoryId, subcategoryId) {
    const lang = 'en'; // أو يمكنك تحديد اللغة من الـ query أو من مكان آخر

    $.ajax({
      url: `${API_BASE_URL}/service/${serviceId}/category/${categoryId}/subcategory/${subcategoryId}`,
      method: 'GET',
      success: function (subcategory) {
        $('#servicesSection').empty(); // Clear the current content

        // استخدام اللغة المحددة في العنوان والوصف والمحتوى
        const title = subcategory.title[lang] || subcategory.title['en'];
        const description = subcategory.description[lang] || subcategory.description['en'];
        const content = subcategory.content[lang] || subcategory.content['en'];

        // إضافة البيانات إلى الـ HTML
        $('#servicesSection').append(`
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${description}</p>
                    <hr>
                    <p class="card-text">${content}</p>
                </div>
            </div>
        `);
      },
      error: function (err) {
        console.error("Error fetching subcategory description:", err);
      }
    });
  }



});

document.addEventListener("DOMContentLoaded", function () {
  const savedLang = localStorage.getItem("selectedLang") || "en"; // الافتراضي الإنجليزية
  document.documentElement.lang = savedLang;
  document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
  document.getElementById("selectedLang").textContent = document.querySelector(`[data-lang="${savedLang}"]`).textContent.trim();

  document.querySelectorAll(".change-lang").forEach(item => {
      item.addEventListener("click", function (event) {
          event.preventDefault();
          const selectedLang = this.getAttribute("data-lang");
          document.documentElement.lang = selectedLang;
          document.documentElement.dir = selectedLang === "ar" ? "rtl" : "ltr";
          document.getElementById("selectedLang").textContent = this.textContent.trim();
          localStorage.setItem("selectedLang", selectedLang); // حفظ اللغة المختارة
      });
  });

  // Check if user data exists in localStorage
  const userName = localStorage.getItem('userName');

  if (userName) {
    // Display user name and dashboard link

    let welcomeText = i18next.t('user_welcome');
    console.log("test",welcomeText);
    if (welcomeText === 'user_welcome') {
      document.getElementById('userName').textContent = `${welcomeText}, ${userName}`;


    } else {
      document.getElementById('userName').textContent = `Welcome, ${userName}`;

    }


    document.getElementById('dashboardLink').style.display = 'inline-block';
    document.getElementById('logoutBtn').style.display = 'inline-block';

    // Hide login and signup buttons
    document.getElementById('loginLink').style.display = 'none';
    document.getElementById('signupLink').style.display = 'none';
  }

  // Handle logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      // Clear user data from localStorage
      localStorage.removeItem('userName');
      localStorage.removeItem('userNameuserEmail');
      localStorage.removeItem('token');

      // Redirect to homepage or login page
      window.location.href = 'index';
    });
  }
});