# pdf-renamer

Renames a series of PDF files based on some text content parsed from the PDF file itself

# Usage

```
$ pdf-renamer [dry] glob-pattern search-regex name-pattern

    dry             If specified, writes output to console
                    only and does not actually rename files

    glob-pattern    File pattern used to identify what
                    source files to rename

    search-regex    Regular expression identifying text
                    content to search for and extract for
                    the new file name

    name-pattern    Pattern for new filename, using $0, $1
                    substitutions for regex captures. Note
                    that all illegal file characgters are
                    automatically converted to dashes in
                    the file name.

Examples:

$ pdf-renamer dry ~/docs/uploads/*.pdf "Invoiced (\d\d.\d\d).(\d\d\d\d)" invoice-$1.pdf

    Explanation

    dry
            Will do a dry run, output to console only

     ~/docs/uploads/*.pdf

             Will look for all files with a .pdf extension
             in the ~/docs/uploads directory

    "Invoiced (\d\d.\d\d).(\d\d\d\d)"

             Will look for the text Invoiced followed by a
             date such as 03/10/2020 and capture the date
             for reuse in the new file name

    invoice-$1.pdf

             Files renamed with the capture with year
             first, such as invoice-2020-03-10.pdf.
```
