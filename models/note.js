import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      validate: function (value) {
        if (value.length > 30) {
          throw new Error('Max title char is 30.');
        }
      },
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    public: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      required: [true, 'Created date is required'],
    },
    updated: {
      type: Date,
      default: Date.now(),
    },
  },
  { versionKey: '_v1' },
);

const Note = mongoose.model('Note', NoteSchema);

export default Note;
