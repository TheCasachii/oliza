const fs = require("fs");

let filename = '';

function assert_file_exists()
{
    if (!fs.existsSync(filename))
        fs.writeFileSync(filename, "{}");
}

function get_file_object()
{
    return JSON.parse(fs.readFileSync(filename, { encoding: "utf-8", flag: "r" }));
}

function save_file_object(file_object)
{
    fs.writeFileSync(filename, JSON.stringify(file_object));
}

let fobj;

class Preferences
{

    constructor()
    {
        throw "The Preferences class cannot be instantiated!";
    }

    static init(file)
    {
        if (typeof file === "string")
        {
            filename = file
        }
        else
        {
            const { PLATFORM } = require("./platform");
            filename = PLATFORM.PREFS_FILE_PATH;
        }
        assert_file_exists();
        fobj = get_file_object();
    }

    static set(key, value)
    {
        fobj[key] = value;
    }

    static get(key)
    {
        return fobj[key];
    }

    static get keys()
    {
        return Object.keys(fobj);
    }
    
    static get the()
    {
        return fobj;
    }

    static save()
    {
        assert_file_exists();
        save_file_object(fobj);
    }

}

module.exports = Preferences;
