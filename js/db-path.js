// Path to an SQLite database.

// Could be one of the following:
//   - local (../data.db),
//   - remote (https://domain.com/data.db)
//   - binary (binary database content)
//   - id (gist:02994fe7f2de0611726d61dbf26f46e4)
//        (deta:yuiqairmb558)
//   - empty

class DatabasePath {
    constructor(value, type = null) {
        this.value = value;
        this.type = type || this.inferType(value);
    }

    // inferType guesses the path type by its value.
    inferType(value) {
        if (!value) {
            return "empty";
        }
        if (value instanceof ArrayBuffer) {
            return "binary";
        }
    }

    // extractName extracts the database name from the path.
    extractName() {
        return '';

    }

    // toHash returns the path as a window location hash string.
    toHash() {
        return "";
    }

    // toString returns the path as a string.
    toString() {
        if (this.type == "binary") {
            return "binary value";
        }  else {
            return "empty value";
        }
    }
}

export { DatabasePath };
