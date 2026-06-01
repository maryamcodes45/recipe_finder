import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const recipeSchema = new mongoose.Schema({
  idMeal: { type: String, required: true, unique: true },
  strMeal: { type: String, required: true },
  strMealAlternate: { type: String, default: '' },
  strCategory: { type: String, required: true },
  strArea: { type: String, default: 'Pakistani' },
  strMealThumb: { type: String, default: '' },
  strDescription: { type: String, default: '' },
  strInstructions: { type: String, required: true },
  strYoutube: { type: String, default: '' },
  tags: [{ type: String }],
  prepTime: { type: String, default: '' },
  cookTime: { type: String, default: '' },
  servings: { type: String, default: '' },
  ingredients: [
    {
      ingredient: { type: String, required: true },
      measure: { type: String, default: '' }
    }
  ],
  reviews: [reviewSchema],
  averageRating: { type: Number, default: 0 }
}, { timestamps: true });

// Pre-save hook to compute average rating
recipeSchema.pre('save', function (next) {
  if (this.reviews && this.reviews.length > 0) {
    const sum = this.reviews.reduce((acc, rev) => acc + rev.rating, 0);
    this.averageRating = parseFloat((sum / this.reviews.length).toFixed(1));
  } else {
    this.averageRating = 0;
  }
  next();
});

const Recipe = mongoose.model('Recipe', recipeSchema);
export default Recipe;
