const mongoose = require('mongoose');

const { Schema } = mongoose.Schema;

// Lesson schema
const lessonSchema = new Schema({
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

// Pre save hook for keeping track of the time a lesson is updated
lessonSchema.pre('save', function(next) {
    const lesson = this;
    const now = new Date();

    lesson.updatedAt = now;

    if (!lesson.createdAt) {
        lesson.createdAt = now;
    }
});

// Export the Lesson model
module.exports = mongoose.model('Lesson', lessonSchema);
