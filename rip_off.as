else if (Input.pressed(Key.DOWN))
{
    var otherBlock:PaletteBlock;
    for (var y:int = mSelectedBlock.mRow+1; y < mBlocks.length; y++)
    {
        otherBlock = mBlocks[mSelectedBlock.mColumn][y];
        if (otherBlock.mColor.Luminance > 0)
        {
            break;
        }
    }
    var tempBlock:PaletteBlock = mSelectedBlock;
    mSelectedBlock = otherBlock;
    otherBlock = tempBlock;
    var blocksBetween = otherBlock.mRow - mSelectedBlock.mRow - 1;
    for (var i:int = 1; i <= blocksBetween; i++)
    {
        var modBlock:PaletteBlock = mBlocks[mSelectedBlock.mColumn][mSelectedBlock.mRow + i];
        var otherColor:RGB = otherBlock.mColor.toRGB();
        var selectedColor:RGB = mSelectedBlock.mColor.toRGB();
        var newColor:RGB = new RGB();
        newColor.Red = FP.lerp(selectedColor.Red, otherColor.Red, i / (blocksBetween + 1));
        newColor.Blue = FP.lerp(selectedColor.Blue, otherColor.Blue, i / (blocksBetween + 1));
        newColor.Green = FP.lerp(selectedColor.Green, otherColor.Green, i / (blocksBetween + 1));

        var blendColor:Object = ColorConverter.rgb2hsv(newColor.Red, newColor.Green, newColor.Blue);

        modBlock.mColor.Hue = blendColor.h;
        modBlock.mColor.Saturation = blendColor.s/100;
        modBlock.mColor.Luminance = FP.lerp(mSelectedBlock.mColor.Luminance, otherBlock.mColor.Luminance, i / (blocksBetween + 1));
    }

}

else if (Input.pressed(Key.RIGHT))
{
    var lightBlock:PaletteBlock = mBlocks[mSelectedBlock.mColumn+1][mSelectedBlock.mRow];
    lightBlock.mColor.Hue = mSelectedBlock.mColor.Hue + FP.sign(mShadowSlider.mHighlightColor - mSelectedBlock.mColor.Hue) * 14;
    lightBlock.mColor.Luminance = mSelectedBlock.mColor.Luminance + .14;
    lightBlock.mColor.Saturation = mSelectedBlock.mColor.Saturation;

    mSelectedBlock = lightBlock;
}