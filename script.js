console.log('starting');
let isSortAscending = false;
let commitList = [];

getCommits().then(commits => {
    commitList = commits;
    loadCommits(commits);
});

async function getCommits() {
    const response = await fetch('https://api.github.com/repositories/19438/commits');
    const commits = await response.json();
    
    const commitList = commits.map(commit => {
        //return only the data that we need
        return {
            authorName: getAuthorName(commit),
            commitDate: getAuthorCommitDate(commit),
            message: getMessage(commit),
            commitURL: getCommitURL(commit)
        };
    });

    return commitList;
}

function loadCommits(commitList) {
    const tableElement = document.getElementById('main-table');
    const tableBodyElements = tableElement && tableElement.getElementsByTagName('tbody');
    const tableBodyElement = tableBodyElements && tableBodyElements[0];

    //if there exists a body on the main-table, delete it
    if (tableBodyElement != null) tableBodyElement.remove();

    
    if ((tableElement != null) && (commitList != null)) {
        //create a new tbody
        const newTBodyElement = document.createElement('tbody');
        
        commitList.forEach(commit => {
            const row = newTBodyElement.insertRow();
            
            //add the author name table data
            const authorNameCell = row.insertCell();
            authorNameCell.innerHTML = commit.authorName;

            //add the author commit date table data
            const commitDateCell = row.insertCell();
            commitDateCell.innerHTML = commit.commitDate;

            //add the commit message table data
            const messageCell = row.insertCell();
            messageCell.innerHTML = commit.message;

            //add the commit url table data
            const commitURLCell = row.insertCell();
            commitURLCell.innerHTML = commit.commitURL;
        });

        tableElement.appendChild(newTBodyElement);
    }
}

function getAuthorName(data) {
    let authorName = '';

    if ((data != null) && (data.commit != null)) {
        const { author } = data.commit;

        if (author != null) authorName = author.name;
    }

    return authorName;
}

function getAuthorCommitDate(data) {
    let commitDateString = '';

    if ((data != null) && (data.commit != null)) {
        const { author } = data.commit;

        if (author != null) commitDateString = author.date;
    }
    
    return new Date(commitDateString);
}

function getMessage(data) {
    let message = '';

    if ((data != null) && (data.commit != null)) {
        message = data.commit.message;
    }
    
    return message;
}

function getCommitURL(data) {
    let commitURL = '';

    if ((data != null) && (data.commit != null)) {
        commitURL = data.commit.url;
    }
    
    return commitURL;
}

function sortByAuthorName() {
    if ((commitList != null) && (commitList.length > 0)) {
        //sort the array
        commitList.sort((a, b) => {
            return (a.authorName || '').toLowerCase().localeCompare((b.authorName || '').toLowerCase());
        });
        loadCommits(commitList);
    }
}

function sortByCommitDate() {
    //toggle sorting
    isSortAscending = !isSortAscending;

    if ((commitList != null) && (commitList.length > 0)) {
        //sort the array
        if (isSortAscending) {
            commitList.sort((a, b) => a.commitDate - b.commitDate);
        } else {
            commitList.sort((a, b) => b.commitDate - a.commitDate);
        }
        loadCommits(commitList);
    }
}



console.log('finishing');
