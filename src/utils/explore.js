// ===================================================================
// This is not used in the project, just a file to explore the data
// ===================================================================

/*
Top-level keys:
==============
bio: array
scoutRankings: array
measurements: array
game_logs: array
seasonLogs: array
scoutingReports: array
*/

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(join(__dirname, '../data/project_data.json'), 'utf-8'));

// Function to get the type of a value
function getType(value) {
    if (Array.isArray(value)) return 'array';
    if (value === null) return 'null';
    return typeof value;
}

// Function to explore object structure
function exploreObject(obj, depth = 0, maxDepth = 2) {
    if (depth > maxDepth) return '...';
    
    const indent = '  '.repeat(depth);
    const result = [];
    
    for (const [key, value] of Object.entries(obj)) {
        const type = getType(value);
        let valueStr;
        
        if (type === 'object' && value !== null) {
            valueStr = `{\n${exploreObject(value, depth + 1, maxDepth)}\n${indent}}`;
        } else if (type === 'array') {
            if (value.length === 0) {
                valueStr = '[]';
            } else {
                const sample = value[0];
                valueStr = `[${value.length} items] - Sample: ${JSON.stringify(sample).slice(0, 100)}...`;
            }
        } else {
            valueStr = JSON.stringify(value);
        }
        
        result.push(`${indent}${key}: ${type} = ${valueStr}`);
    }
    
    return result.join('\n');
}

// Print the structure
console.log('JSON Structure:');
console.log('==============');
console.log(exploreObject(data));

// Print top-level keys and their types
console.log('Top-level keys and their structure:');
console.log('==================================\n');

Object.entries(data).forEach(([key, value]) => {
    console.log(`\n${key.toUpperCase()}:`);
    console.log('='.repeat(key.length + 1));
    
    if (Array.isArray(value)) {
        console.log(`Type: Array with ${value.length} items`);
        if (value.length > 0) {
            console.log('\nSample item structure:');
            console.log(JSON.stringify(value[0], null, 2));
        }
    } else {
        console.log(`Type: ${typeof value}`);
        if (typeof value === 'object' && value !== null) {
            console.log('\nStructure:');
            console.log(JSON.stringify(value, null, 2));
        }
    }
    console.log('\n' + '-'.repeat(50));
});

// If there's an array, show sample of first item
console.log('\nSample data from first array item (if any):');
console.log('=========================================');
const firstArray = Object.values(data).find(val => Array.isArray(val));
if (firstArray && firstArray.length > 0) {
    console.log(JSON.stringify(firstArray[0], null, 2));
} 