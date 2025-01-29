# Candidate Search Application

## Description
This project is a Candidate Search application built with TypeScript and React. It interacts with the GitHub API to retrieve and display candidate profiles. Users can accept or reject candidates, and accepted candidates are stored in local storage for future reference. The application is deployed on Render.

## Features
- Fetches candidate profiles from GitHub API
- Displays candidate information including name, username, location, avatar, email, GitHub profile, and company
- Allows users to accept or reject candidates
- Saves accepted candidates in local storage
- Displays a list of saved candidates
- Persistent storage for accepted candidates
- Deployed to Render

## Technologies Used
- TypeScript
- React
- GitHub API
- Local Storage
- Render (for deployment)

## Installation and Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/Jesuscatalan/candidate-search.git
   ```
2. Navigate to the project directory:
   ```sh
   cd candidate-search
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Create a `.env` file in the `environment` folder and add your GitHub Personal Access Token:
   ```sh
   VITE_GITHUB_TOKEN=your_personal_access_token
   ```
5. Start the development server:
   ```sh
   npm run dev
   ```
6. Open the application in your browser at `http://localhost:`

To deploy your own version:
1. Push your project to a GitHub repository.
2. Create a new web service on Render.
3. Connect it to your GitHub repository.
4. Set up environment variables on Render.
5. Deploy and access your live application.

## Challenges & Learnings
During development, I learned how to:
- Work with TypeScript and interfaces for API responses
- Manage state and props in React effectively
- Store and retrieve data using local storage
- Deploy a React application to Render with environment variables

## Future Improvements
- Implement sorting and filtering for saved candidates
- Enhance UI design for better user experience
- Improve error handling for API requests


## License
This project is licensed under the MIT License.

## Contact
If you have any questions, feel free to reach out:
- GitHub: [Jesuscatalan](https://github.com/Jesuscatalan)
- Email: Jesusecatalan101598@icloud.com

