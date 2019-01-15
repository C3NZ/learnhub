const mongoose = require('mongoose');

const { Schema } = mongoose.Schema;

// Curriculum schema
const curriculumSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    lessons: {
        type: [mongoose.Types.ObjectId],
        ref: 'Lesson'
    },
    assignments: {
        type: [mongoose.Types.ObjectId],
        ref: 'Assignment',
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },

});

// Pre save hook for keeping track of the update and creation time of the curriculum
curriculumSchema.pre('save', function(next) {
    const lesson = this;
    const now = new Date();

    lesson.updatedAt = now;

    if (!lesson.createdAt) {
        lesson.createdAt = now;
    }
});

// Export the Lesson model
module.exports = mongoose.model('Curriculum', curriculumSchema);
