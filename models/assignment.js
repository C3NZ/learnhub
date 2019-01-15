const mongoose = require('mongoose');

const { Schema } = mongoose.Schema;

// Assignment schema
const assignmentSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    filePath: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date
    },

});

// Pre save hook for keeping track of the Assignment creation and updates
assignmentSchema.pre('save', function(next) {
    const lesson = this;
    const now = new Date();

    lesson.updatedAt = now;

    if (!lesson.createdAt) {
        lesson.createdAt = now;
    }
});

// Export the Assignment model
module.exports = mongoose.model('Assignment', assignmentSchema);
