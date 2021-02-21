var higherScore = localStorage.getItem("HigherScore") ;

function checkHigherScore()											// Fonction de gestion du HigherScore
{
	if ( localStorage.getItem("HigherScore") === null )
	{
		higherScore = score ;
		localStorage.setItem("HigherScore", higherScore);
	}
	else
	{
		if ( score > higherScore )
		{
			higherScore = score ;
			localStorage.setItem("HigherScore", higherScore);
		}
		else
		{
			higherScore = higherScore ;
		}
	}
}