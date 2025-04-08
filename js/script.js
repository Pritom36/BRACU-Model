document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('nav ul');
    
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('show');
    });

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                navMenu.classList.remove('show');
            }
        });
    });
    
    // Header Scroll Effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Load Model Questions
    const questionsContainer = document.getElementById('questions-container');
    const pageNumbers = document.getElementById('page-numbers');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    
    const questionsPerPage = 9;
    let currentPage = 1;
    
    // Generate questions array
    const totalQuestions = 30;
    const questions = Array.from({length: totalQuestions}, (_, i) => ({
        id: i + 1,
        title: `Model Question ${i + 1}`
    }));
    
    function renderQuestions(page) {
        questionsContainer.innerHTML = '';
        const startIndex = (page - 1) * questionsPerPage;
        const endIndex = Math.min(startIndex + questionsPerPage, questions.length);
        
        for (let i = startIndex; i < endIndex; i++) {
            const question = questions[i];
            const questionCard = document.createElement('div');
            questionCard.className = 'question-card';
            
            questionCard.innerHTML = `
                <a href="model-questions/model-${question.id}.html">
                    <div class="question-content">
                        <h3>${question.title}</h3>
                        <span class="view-btn">View Question</span>
                    </div>
                </a>
            `;
            
            questionsContainer.appendChild(questionCard);
        }
        
        prevPageBtn.disabled = page === 1;
        nextPageBtn.disabled = page === Math.ceil(questions.length / questionsPerPage);
        
        updatePageNumbers(page);
    }
    
    function updatePageNumbers(currentPage) {
        pageNumbers.innerHTML = '';
        const totalPages = Math.ceil(questions.length / questionsPerPage);
        
        for (let i = 1; i <= totalPages; i++) {
            const pageNumber = document.createElement('span');
            pageNumber.className = `page-number ${i === currentPage ? 'active' : ''}`;
            pageNumber.textContent = i;
            
            pageNumber.addEventListener('click', function() {
                if (i !== currentPage) {
                    currentPage = i;
                    renderQuestions(currentPage);
                    window.scrollTo({ 
                        top: questionsContainer.offsetTop - 100, 
                        behavior: 'smooth' 
                    });
                }
            });
            
            pageNumbers.appendChild(pageNumber);
        }
    }
    
    // Pagination Event Listeners
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderQuestions(currentPage);
            window.scrollTo({ top: questionsContainer.offsetTop - 100, behavior: 'smooth' });
        }
    });
    
    nextPageBtn.addEventListener('click', function() {
        if (currentPage < Math.ceil(questions.length / questionsPerPage)) {
            currentPage++;
            renderQuestions(currentPage);
            window.scrollTo({ top: questionsContainer.offsetTop - 100, behavior: 'smooth' });
        }
    });
    
    // Initialize questions
    renderQuestions(currentPage);
    
    // Search functionality
    const searchBox = document.querySelector('.search-box input');
    searchBox.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        if (searchTerm.length > 0) {
            const filteredQuestions = questions.filter(question => 
                question.title.toLowerCase().includes(searchTerm)
            );
            
            const originalQuestions = [...questions];
            questions.length = 0;
            questions.push(...filteredQuestions);
            
            renderQuestions(1);
            
            questions.length = 0;
            questions.push(...originalQuestions);
        } else {
            renderQuestions(currentPage);
        }
    });
});

