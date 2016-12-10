# node-content-scraper

This Content Scraper was developed to meet the criteria of teamTreehouse's Project 6.
The program performs to the following specifications:

1.  Create a scraper.js file. This should be the file that runs every day.

2.    The scraper should create a folder called <code>data</code>, if a folder called <code>data</code> doesn't already exist (it should check for the folder).

3.  The information from the site you scrape should be stored in a CSV file named after today's date: 2016-01-29.csv.

4.  Use a third party npm package to scrape content from the site. As part of this assignment, you'll need to explain why you chose this package.

5.  The scraper should be able to visit the website http://shirts4mike.com and follow links to all t-shirts.

6.  The scraper should get the price, title, url and image url from the product page and save it in the CSV.

7.  Use a third party npm package to create an CSV file. As part of this assignment, you’ll need to explain why you chose this package.

8.  The column headers should be in this order: Title, Price, ImageURL, URL and Time. ‘Time’ should be the time the scrape happened. The columns must be in order (if we were really populating a database, the columns would need to be in order correctly populate the database).

9.  If the site is down, an error message describing the issue should appear in the console.  You can test your error by disabling the wifi on your computer.

10.  If the data file for today’s date already exists, your program should overwrite the file.

11.  Don't forget to document your code!

For extra credit:

1.  Use a linting tool like ESLint to check your code for syntax errors and to ensure general code quality. You should be able to run npm run lint to check your code.

2.  When an error occurs log it to a file <code>scraper-error.log</code> . It should append to the bottom of the file with a time stamp and error e.g. <code>[Tue Feb 16 2016 10:02:12 GMT-0800 (PST)] &lt;error message&gt;