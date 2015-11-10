from os import listdir
from os.path import isfile, join, isdir

dirs = ['classes', 'res', 'main.js']
files = ['../main.js']
linesAmount = 0
emptyLinesAmount = 0
filesAmount = 0;
extension = '.js'

def countFiles(path):
    if isfile(path):
        global extension
        global linesAmount
        global emptyLinesAmount
        global filesAmount

        if path[-3:] != extension:
            return
        f = open(path, 'r')
        lines = f.readlines()
        emptyLines = len([x for x in lines if x in ['\n', '\r\n']])
        emptyLinesAmount += emptyLines
        ll = len(lines) - emptyLines
        linesAmount += ll
        filesAmount += 1;
        print "%5d %s " %( ll, path)
    elif isdir(path):
        dirs = listdir(path)
        for file in dirs:
            countFiles(path + '/' + file)

for dir in dirs:
    countFiles('../' + dir)
print ""
print "%5d lines of code in %d files" % (linesAmount, filesAmount)
print "%5d empty lines" %emptyLinesAmount