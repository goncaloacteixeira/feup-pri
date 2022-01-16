# Solr 101: Running, Indexing, Retrieving

[Solr](http://solr.apache.org) (pronounced _solar_) is a common choice for Information Retrieval system implementations due to the project's maturity.
There are other popular alternatives (notably, [Elasticsearch](https://www.elastic.co/what-is/elasticsearch)).
You are free to explore them and even use them in your project, but we won't go over them here.

In this small tutorial, we will go through the most common steps to quickly get a functional search system up and running, as well as explore some basic querying capabilities available to us.

## 1. Running Solr
Solr is most easily instantiated as a Docker container.
There is an [official image](https://hub.docker.com/_/solr/) that we can pull and run on our local machine with little effort, as long as Docker is installed, of course.
The classroom's computers should have it.
If you need to install it on your personal computer, see [this guide](https://docs.docker.com/engine/install/) or, if you're using a Linux distribution, you may also refer to your respective package manager (apt, yum, pacman, …).

With Docker available, running Solr is done by running `docker run --name my_solr -p 8983:8983 solr:8.10`. Optionally, you can also include the `-d` option so that the container runs in detached mode and frees the terminal window. With the `--name` option you can reference your conatiner by name (instead of the container's id).

Two important things to note:
1. We must map the port where Solr is running to some port on our host machine so that we can access the administration interface. Here, we left it at the default, 8983, but you can pick any port, as long as it's available;
2. We're running an instance of Solr 8.10. This is the latest stable version as of the time of writing and, therefore, the recommended one.
You should stick with a specific version after you've picked it.

After it's done booting, you can access http://localhost:8983 (change port accordingly if necessary) and you should see a screen like this:

![Solr interface after booting up](images/solr_post_boot.png)

It is important to note that, when you kill the Docker container, you will lose all the progress you have made previously.
The easiest way to ensure a consistent workspace is to define a custom Docker image, based on Solr's, that performs all preparation operations when booting, so that you don't have to perform them manually every time you start working.
You can find an example [Dockerfile](Dockerfile) in this folder that defines a custom image in this manner and that performs all the basic setup operations we'll be seeing in this tutorial.
To build the image, run `docker build . -t meic_solr` (where `meic_solr` is our custom image's name) in this directory.
To execute it, similar to before, run `docker run -p 8983:8983 meic_solr`.

Other options include working with Docker volumes, which can be tricky here since collection information is stored on write-protected directories; or running Solr directly on your host machine, which will keep these files even after shutdown.
This has the unfortunate downside of, on one hand, polluting your machine, as well as making it more difficult to automate and share progress with your colleagues.

## 2. Indexing Data
### Creating a Collection
Before we can index our data in Solr, we must first create a collection.
In Solr, you may often see the term *core* being used, like in the web interface we'll be working on, because we are running a single Solr instance.
They are not the same, and their difference relies on how an index scales, but for our purposes, you can think of these terms interchangeably.

The easiest way to create a collection is to use one of Solr's helper tools available inside the container, more specifically `create_core`.
In a terminal, run `docker exec <containerName> bin/solr create_core -help`.
After reading through the usage (a lot of that stuff doesn't matter here!), go ahead and create our collection named *courses*.

### Populating the Collection
After our collection has been created, we can upload some data to its index that we can later retrieve.
Our collection will hold documents, each with a certain number of fields.
Not all the documents need to have the same fields, but there is a way to force the presence of expected fields.
We will see more on that later.
The most important thing to remember is the `id` field, which must be unique to each document in the collection.

Solr supports several data formats for uploading data.
Here we'll stick to one of the more frequent, JSON.
We have our [meic_courses.json](meic_courses.json), a small dataset with a few fields for most of the courses available in the Informatics and Computing Engineering Masters (MEIC).
There are two main ways to upload data: through Solr's API or by another of its helper tools, `post`.

**Using the API**

The endpoint to update a collection is `/solr/<collectionName>/update?commit=true`.
By making a POST request with the data to be indexed, our collection will finally have something we can get back.
`curl` is a tool that makes the request very easy to build.

```console
curl -X POST -H 'Content-type:application/json' \
--data-binary @path/documents.json \
http://localhost:8983/solr/courses/update
```

**Using the `post` tool**

Similar to the collection creation step, we will issue a similar command in the command line towards our container. The tool is located under the `bin` folder, so to see usage instructions run `docker exec <containerName> bin/post -h`.

Feel free to read through the different options and file formats available. Note that using Solr's `post` command inside the Docker container will require that the data to index is also inside the container.

Regardless of how you upload your data, remember this is a non-idempotent operation.
Unless you explicitly set the document id before uploading, if you run the operation multiple times, you may end up with repeated documents.

With our data uploaded, we should be ready for querying.
Going back to the UI (might need a refresh), if we now select our new collection (core), there should be a *Query* tab under it.
There's a bunch of query configurations that we'll see next, but for now, just hit *Execute Query*.
The default configs will fetch all documents, as seen below.

![Fetch all documents query](images/all_docs.png)

Good, but why are all the fields, except the id, lists?
Well, since we didn't specify an expected format for our documents to follow, Solr followed a `schemaless mode`, which looks at field values as they arrive and tries to fit them in what it thinks is the most appropriate field type.
Naturally, it has its flaws, and most importantly limitations, so not having a schema defined before uploading data is something one would never do in a production environment, so, naturally, you are expected to explore schemas in your practical work.

### Schemas and Analyzers
While it was a bit strange that all fields were transformed to lists, it didn't seem like a deal-breaker.
After all, we could still search.
Let's retrieve all courses about any sort of computing by querying for that word in the title field.

![Query 'computaçao' in schemaless mode](images/computacao_query.png)

No results.
This is certainly unpleasant, since, when retrieving all documents, we could see at least one course about computing ("Computação Paralela Avançada").
Simply because we forgot an accent, which may happen often, Solr was not able to match anything internally.
In a real-world scenario, this wouldn't provide a positive user experience.
This is where schemas and analyzers come in.

A *schema* is nothing more than a configuration file that specifies what fields and field types Solr should understand when indexing new documents.
Field types describe *analyzers*, which are pipelines that take a field's text value as input, and produce a token stream as output.
This stream output is what will be indexed by the engine (i.e., what is used to match against search keywords later), but won't affect what is stored (i.e., the original value).

An analyzer has two main components:
- one *tokenizer*, which takes a stream of text and partitions it into an initial token stream. A very simple tokenizer could be splitting text on whitespace or punctuation;
- one or more *filters*, which take as input a token stream and produce new streams as output. In practice, they work similarly to pipes in Unix systems: one step's output is the next step's input, successively until we have one final output stream.

You can find a complete list of available [tokenizers](https://solr.apache.org/guide/8_10/tokenizers.html) and [filters](https://solr.apache.org/guide/8_10/filter-descriptions.html) online.
Each one can have input parameters to fine-tune the component's behavior
You can also define custom tokenizers or filters, but that is an advanced topic that you shouldn't need in this course.

One last important aspect of analyzers is that they run on two distinct occasions: one runs at *index time*, i.e., when a new document is added, each field is processed accordingly and the resulting set of terms indexes for future search.
The second one, as you probably expected, runs at *query time*, and processes the query text given by the searcher.
Usually, they will be at least very similar in structure, but there may be some requirements that dictate some difference between them.

The easiest way to update a schema is to use Solr's *managed schema*, which allows the user to update a collection's schema via their API.
You should, of course, do this before actually indexing any document, since schema changes won't be applied retroactively. You can delete a core with `docker exec <containerName> bin/solr delete -c <coreName>`

For our example, let us create a new field type to process course titles more accordingly, more specifically ignore accents on matching, and then declare the `title` field to that new custom type.

Here is the JSON file defining the new field type and setting the `title` to this new field type.

```json
{
	"add-field-type": [
        {
            "name":"courseTitle",
            "class":"solr.TextField",
            "indexAnalyzer":{
                "tokenizer":{
                    "class":"solr.StandardTokenizerFactory"
                },
                "filters":[
                    {"class":"solr.ASCIIFoldingFilterFactory", "preserveOriginal":true},
                    {"class":"solr.LowerCaseFilterFactory"}
                ]
            },
            "queryAnalyzer":{
                "tokenizer":{
                    "class":"solr.StandardTokenizerFactory"
                },
                "filters":[
                    {"class":"solr.ASCIIFoldingFilterFactory", "preserveOriginal":true},
                    {"class":"solr.LowerCaseFilterFactory"}
                ]
            }
        }
    ],
    "add-field": [
        {
            "name": "title",
            "type": "courseTitle",
            "indexed": true
        }
    ]
}
```

The [Schema API](https://solr.apache.org/guide/8_10/schema-api.html) allows you to perform multiple operations at once, so we are able to do this with one request:

```console
curl -X POST -H 'Content-type:application/json' \
--data-binary @path/schema.json \
http://localhost:8983/solr/courses/schema
```

And now, when we perform the same query again, on the same data (reindexed!), we get the results we were hoping for:

![Query 'computaçao' with a schema set up](images/query_computacao_with_analyzer.png)

Much better.

You can get the details of a specific field with a GET request to the `/solr/<collectionName>/schema/fields` endpoint. In our working example we can see the definition of the `title` field.

```console
curl -X GET http://localhost:8983/solr/courses/schema/fields/title
```

Additionally, we can get information about the newly created `courseTitle` field type.

```console
curl -X GET http://localhost:8983/solr/courses/schema/fieldtypes/courseTitle
```

This is, of course, a simple example to illustrate the importance and power of analyzers and properly configured schemas.
In your work, you are encouraged to explore different combinations to assess what best fits your documents.
Don't just leave it at Solr's default guess, because your future results will be negatively affected.

## 3. Retrieving Data
We finally have our collection ready to be queried, but how exactly do we do that?
As you can probably tell from the web interface, Solr provides us with a number of options to fine-tune our search, instead of the traditional "here's some keywords, give me stuff".
The most important aspects will, nevertheless, still be present in the query field.
Let's quickly run through some commonly available options in the interface.

We'll use the default *request handler* (`/select`), so no need to worry about that.
The *query* field (`q`) is where we will input the query string, which may need to follow a specific pattern depending on the query parser used.
However, some options are universally available:
- Wildcards (e.g., the query "pro*" would match both "processamento" in this course and "projetos" in the LGP course);
- Fuzziness (match terms that differ on word edit distance by at most N characters);
- Proximity (terms must appear within N terms of each other);
- Ranges (values must fall within specified range - can also be used in textual fields)
- Term boosting (e.g., query "processamento^4 informação" would give matches on "processamento" four times more relevance than on "informação")

Moreover, the query parser can be changed accordingly via the `defType` parameter.
The *query operator* defines how multiple search terms are to be combined: either they must all be present (AND), or one is sufficient (OR).

*Filter query* (`fq`) allows to filter search result without affecting the relevance score calculation, e.g., return all courses with "computação" somewhere in their fields, but we're only interested in those with a minimum number of students enrolled.
*Field list* (`fl`) allows to only return a subset of the documents, which can be useful if network limitations apply.
Furthermore, it is possible to define custom fields that are based on the value of other ones.
It is also possible to specify the special field `score`, which contains the internal relevance score calculated.
The `sort` field allows sorting results on other scores other than relevance.

Below is an example query, using the standard parser, that explores some of the functionalities provided by Solr.


![Sample query using some standard parser functionalities](images/example_query.png)

Notice the search in different fields, the independent query filter to exclude courses with no students enrolled, a custom field returned (number of students doubled) and the relevance score.
Above the search results, there is also an endpoint which would be the equivalent of what we just did if performed via Solr's REST API.
Overall, interesting, but cumbersome, especially on the query field itself.
Surely we can do better.

We spoke previously of different query parsers.
Indeed, aside from the default query parser, which is heavily inspired on the Lucene query parser, there are two main parsers supported: [`DisMax`](https://solr.apache.org/guide/8_10/the-dismax-query-parser.html) (Maximum Disjunction - "_A query that generates the union of documents produced by its subqueries, and that scores each document with the maximum score for that document as produced by any subquery (…)._" and [`eDisMax`](https://solr.apache.org/guide/8_10/the-extended-dismax-query-parser.html) (Extended DisMax).

These parsers offer some extended functionalities, such as more advanced (and customized) boosting, minimum match requirements, more advanced phrase matching (with term slop), among others, without comprimising what is offered by the standard parser, while offering a more natural querying syntax. 
Think of how these different options could be used in your work.
You are encouraged and expected to explore Solr's different querying capabilities when fulfilling the identified information needs.

As always, for a more complete reference on query syntax, refer to [Solr Query Syntax and Parsing](https://solr.apache.org/guide/8_10/query-syntax-and-parsing.html).

## Further Information
This guide is meant as a "survival kit" to help guide you towards some of the most important aspects of Solr and should not be taken as an absolute truth.
For any further details or for future reference, always refer to Solr's online documentation at https://solr.apache.org/guide/8_10/about-this-guide.html.
It should cover all your needs.