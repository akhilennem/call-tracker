# call-tracker

DB used - MongoDB

    Mainly i'm more confortable using mongo than SQL 
    and also we dont need to alter the tables like sql in mongo whenever we change the structure of the collection
    and also mongo document supports array and objects directly
    No need to worry about joins, foreign key etc.
    Also aggregation framework is very powerfull for performing particular tasks within a query such as count,sum etc..


Database Strucure

    UUID for _id
    We use a UUID as the _id field for better uniqueness across distributed systems, especially if calls are logged from different devices or regions.

    Many-to-Many Relationship
    The relationship between sales officers and clients is many-to-many, but instead of managing it through a join table (like in SQL), we use the calls collection     as the connector:

    One officer can have many calls with many clients.

    One client can be contacted by multiple officers.
    This setup allows efficient querying, grouping, and analytics using MongoDB's aggregation framework.

    Added indexing in frequenyly accessing fields such as officerID, clientID, timestamps etc for reduce the query time

    Real-Time Logging Support
    The schema supports real-time call logging via socket.io.


Scalability

    Clustering-:
    Implemented Clustering to maximise the perfomance and scalability by taking advantage of multi core CPUs

    Redis:-
    Implemeted redis to reduce the query time for a faster query response.

    rate-limit:-
    Implemented rate limit to reduce the number of requests and also to avoid DOS attacks from a particular ip for a particular time period. 

    Pagination:-
    Implemented pagination to reduce query and response time by setting limit and skip values
