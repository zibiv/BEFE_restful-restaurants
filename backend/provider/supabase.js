const path = require('path');
require('dotenv').config({path:path.resolve(__dirname, '../.env')});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET);

module.exports = supabase;
